from locust import HttpUser, task, between

class GuestUser(HttpUser):
    wait_time = between(1, 3)

    @task
    def home(self):
        self.client.get("/")  

    @task
    def articles(self):
        self.client.get("/articles")  

    @task
    def problems(self):
        self.client.get("/problems")

    @task
    def courses(self):
        self.client.get("/courses")    
    
    @task
    def quizzes(self):
        self.client.get("/quizzes")

    @task
    def tester(self):
        self.client.get("/user/tester")

    @task
    def article(self):
        self.client.get("/article/1")  

    @task
    def problem(self):
        self.client.get("/problem/1")  
