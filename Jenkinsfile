pipeline {
    agent any
    
    environment {
        NODEJS_HOME = tool 'NodeJS'
    }

    tools {
        nodejs "NodeJS"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh "echo 'NODEJS_HOME: ${NODEJS_HOME}'" 
                sh "'${NODEJS_HOME}/bin/npm' install"
            }
        }
        
        stage('Security Testing') {
            steps {
                dependencyCheckPublisher pattern: 'package-lock.json'
                
                L: script {
                    def zap = zap(
                        failBuild: true,
                        zapHome: '/Users/daniilalekseev/Downloads/ZAP_2.14.0',
                        port: 8080 
                    )

                    zap.waitForSuccessfulStartup()
                    zap.ascan(scanPolicy: 'Light', url: 'http://localhost:3000')
                    zap.spider(url: 'http://localhost:3000')
                    
                    zap.zapReport(
                        fileType: 'html',
                        filePath: 'zap-report.html',
                        includeHtmlReport: true,
                        includeXmlReport: false,
                        includeJsonReport: false
                    )
                }
            }
        }
        
        stage('Unit Tests') {
            steps {
                sh "echo 'NODEJS_HOME: ${NODEJS_HOME}'" 
                sh "'${NODEJS_HOME}/bin/npm' test"
            }
        }
        
        stage('Integration Tests') {
            steps {
                sh 'echo "Running integration tests"'
                sh 'echo "Placeholder command for integration tests"'
            }
        }
    }
}
