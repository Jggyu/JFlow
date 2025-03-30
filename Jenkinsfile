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
        SONAR_TOKEN = credentials("sonarqube-credentials")
        HARBOR_CREDENTIALS = credentials("${DOCKER_CREDENTIALS_ID}")
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('SonarQube Analysis') {
            steps {
                container('sonar-scanner') {
                    withSonarQubeEnv('sonarqube') {
                        sh """
                            sonar-scanner \\
                            -Dsonar.projectKey=${HARBOR_PROJECT}-${IMAGE_NAME} \\
                            -Dsonar.projectName=${HARBOR_PROJECT}-${IMAGE_NAME} \\
                            -Dsonar.sources=src \\
                            -Dsonar.exclusions=**/node_modules/**,**/*.test.js,**/*.spec.js \\
                            -Dsonar.login=${SONAR_TOKEN}
                        """
                    }
                }
            }
        }

        stage('Create Docker Config') {
            steps {
                script {
                    sh """
                        mkdir -p /home/jenkins/agent/.docker
                        echo '{"auths":{"${REGISTRY}":{"username":"${HARBOR_CREDENTIALS_USR}","password":"${HARBOR_CREDENTIALS_PSW}"}}}' > /home/jenkins/agent/.docker/config.json
                        cat /home/jenkins/agent/.docker/config.json
                        cp /home/jenkins/agent/.docker/config.json /home/jenkins/agent/config.json
                    """
                    
                    container('kaniko') {
                        sh """
                            mkdir -p /kaniko/.docker
                            cp /home/jenkins/agent/config.json /kaniko/.docker/config.json
                            ls -la /kaniko/.docker
                        """
                    }
                }
            }
        }

        stage('Build and Push with Kaniko') {
            steps {
                container('kaniko') {
                    sh """
                        /kaniko/executor \\
                        --context=\$(pwd) \\
                        --destination=${DOCKER_IMAGE}:${BUILD_NUMBER} \\
                        --cleanup
                    """
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