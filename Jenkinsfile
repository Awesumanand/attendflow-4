pipeline {
    agent any

    stages {

        stage('Checkout Code') {
            steps {
                echo 'Pulling code from GitHub...'
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing Node.js packages...'
                dir('backend') {
                    sh 'npm install'
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                echo 'Building Docker image...'
                sh 'docker build -t attendflow-backend:latest ./backend'
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying application...'
                sh 'docker stop attendflow-backend-1 || true'
                sh 'docker rm attendflow-backend-1 || true'
                sh 'docker run -d --name attendflow-backend-1 -p 3000:3000 --env-file ./backend/.env attendflow-backend:latest'
            }
        }

    }

    post {
        success {
            echo 'BUILD SUCCESS - AttendFlow is deployed!'
        }
        failure {
            echo 'BUILD FAILED - Check the logs above'
        }
    }
}