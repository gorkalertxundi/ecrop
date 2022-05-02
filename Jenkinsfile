pipeline {

    agent any
    
    stages {
        stage('Build') {
            steps {
                echo '----- Build app -----'
                withMaven (maven: 'M3') {
                    withCredentials([]) {
                        sh 'mvn clean compile'
                    }
                }
            }
        }
        stage('Unit Testing') {
            steps {
                echo '----- Test app -----'
                withMaven (maven: 'M3') {
                    withCredentials([string(credentialsId: 'jasypt-secret', variable: 'JASYPT')]) {
                        sh 'mvn test -Dspring.profiles.active=ci \
                            -Djasypt.encryptor.password=${JASYPT}'
                    }
                }
            }
        }
        stage('Static Analysis') {
            steps {
                withMaven(maven: 'M3') {
                    withSonarQubeEnv(installationName:'SonarQube', credentialsId: 'sonar-token') {
                        withCredentials([string(credentialsId: 'sonar-token', variable: 'SONAR_TOKEN')]) {
                                            sh 'mvn sonar:sonar \
                                                -Dsonar.host.url=https://sonarsolaris.ddns.net \
                                                -Dsonar.login=${SONAR_TOKEN} \
                                                -Dsonar.sources=src/main/resources,src/main/java \
                                                -Dsonar.tests=src/test \
                                                -Dsonar.java.coveragePlugin=jacoco \
                                                -Dsonar.dynamicAnalysis=reuseReports'
                        }
                    }
                }
            }
        }
        stage('QualityGate') {
            steps {
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true, credentialsId: 'sonar-token'
                }
            }
        }
        stage('Deploy') {
            when {
                branch 'master'
            }
            steps {
                echo '----- Deploy app -----'
                withMaven (maven: 'M3') {
                    withCredentials([]) {
                        sh 'mvn -Dmaven.test.skip package'
                    }
                }
                script {
                    deploy adapters: [tomcat9(credentialsId: 'tomcat-deploy-user', path: '', url: 'https://ecrop.ddns.net')], contextPath: '/', onFailure: false, war: '**/*.war'
                }
            }
        }
    }
}