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