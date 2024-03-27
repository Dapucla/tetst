pipeline {
    agent any
    
    stages {
        stage('Monitor') {
            steps {
                sh 'docker run -d --name prometheus -p 9090:9090 prom/prometheus'
                sh 'docker run -d --name grafana -p 3000:3000 grafana/grafana'
            }
        }
    }
}
