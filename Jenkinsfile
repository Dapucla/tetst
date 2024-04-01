pipeline {
    agent any
    
    environment {
        NODEJS_HOME = tool 'NodeJS'
        ZAP_HOME = './Users/daniilalekseev/Downloads/ZAP_2.14.0'
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
                
                script {
                    def zap = zap(
                        failBuild: true,
                        home: env.ZAP_HOME,
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
                junit '**/test-results/*.xml' // Assuming unit test results are in XML format
            }
        }
        
        stage('Integration Tests') {
            steps {
                sh 'echo "Running integration tests"'
                sh 'npm run integration-test' // Assuming you have an npm script for running integration tests
                junit '**/integration-test-results/*.xml'
            }
        }
    }
}
