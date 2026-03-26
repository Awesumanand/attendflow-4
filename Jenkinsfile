pipeline {
    agent any
    stages {
        stage('Checkout Code') {
            steps {
                checkout scm
                echo 'Code pulled successfully!'
            }
        }
        stage('Install Dependencies') {
            steps {
                dir('backend') {
                    sh 'npm install'
                }
            }
        }
        stage('Test App') {
            steps {
                sh 'curl -s http://host.docker.internal:3000/api/employees && echo "App is healthy!"'
            }
        }
    }
    post {
        success { echo 'BUILD SUCCESS!' }
        failure { echo 'BUILD FAILED' }
    }
}