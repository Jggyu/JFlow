pipeline {
    agent {
        kubernetes {
            label 'kaniko-agent'
            defaultContainer 'kaniko'
        }
    }

    environment {
        REGISTRY = 'harbor.jbnu.ac.kr'
        HARBOR_PROJECT = 'zmfltmvl'
        IMAGE_NAME = 'jflow'
        DOCKER_IMAGE = "${REGISTRY}/${HARBOR_PROJECT}/${IMAGE_NAME}"
        DOCKER_CREDENTIALS_ID = 'harbor-credentials'
        SERVER_IP = '113.198.66.77'
        SERVER_PORT = '18196'
        SERVER_USER = 'ubuntu'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Create Docker Config') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'harbor-credentials', 
                                                usernameVariable: 'HARBOR_USER', 
                                                passwordVariable: 'HARBOR_PASS')]) {
                    sh '''
                        mkdir -p /home/jenkins/agent/.docker
                        echo '{"auths":{"'''+REGISTRY+'''":{"username":"'''+HARBOR_USER+'''","password":"'''+HARBOR_PASS+'''"}}}' > /home/jenkins/agent/.docker/config.json
                        cp /home/jenkins/agent/.docker/config.json /home/jenkins/agent/config.json
                    '''
                    
                    container('kaniko') {
                        sh '''
                            mkdir -p /kaniko/.docker
                            cp /home/jenkins/agent/config.json /kaniko/.docker/config.json
                            ls -la /kaniko/.docker
                        '''
                    }
                }
            }
        }

        stage('Build and Push with Kaniko') {
            steps {
                container('kaniko') {
                    sh '''
                        /kaniko/executor \\
                        --context=$(pwd) \\
                        --destination=${DOCKER_IMAGE}:${BUILD_NUMBER} \\
                        --cleanup
                    '''
                }
            }
        }
        
        stage('Deploy to Server') {
            steps {
                container('ssh') {
                    withCredentials([
                        sshUserPrivateKey(credentialsId: 'server-ssh-key', keyFileVariable: 'SSH_KEY'),
                        usernamePassword(credentialsId: 'harbor-credentials', usernameVariable: 'HARBOR_USER', passwordVariable: 'HARBOR_PASS')
                    ]) {
                        sh '''
                            mkdir -p ~/.ssh
                            cp ${SSH_KEY} ~/.ssh/id_rsa
                            chmod 600 ~/.ssh/id_rsa
                            ssh-keyscan -H ${SERVER_IP} >> ~/.ssh/known_hosts
                            
                            echo "Deploying to ${SERVER_IP}..."
                            ssh -o StrictHostKeyChecking=no ${SERVER_USER}@${SERVER_IP} "
                                docker login ${REGISTRY} -u ${HARBOR_USER} -p ${HARBOR_PASS} &&
                                
                                docker pull ${DOCKER_IMAGE}:${BUILD_NUMBER} &&
                                
                                docker stop jflow-app || true &&
                                docker rm jflow-app || true &&
                                
                                docker run -d --name jflow-app -p 80:80 --restart unless-stopped ${DOCKER_IMAGE}:${BUILD_NUMBER} &&
                                
                                echo '배포 완료: http://${SERVER_IP}:${SERVER_PORT}'
                            "
                        '''
                    }
                }
            }
        }
    }

    post {
        success {
            echo 'React 애플리케이션 빌드 및 배포 성공!'
        }
        failure {
            echo '빌드 또는 배포 과정에서 오류가 발생했습니다.'
        }
        always {
            deleteDir()
            echo "파이프라인 완료 및 리소스 정리"
        }
    }
}