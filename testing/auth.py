from locust import HttpUser, task, between
import json

class LoginUser(HttpUser):
    wait_time = between(1, 3)

    def __init__(self, parent):
        super(LoginUser, self).__init__(parent)
        self.token = ""

    def on_start(self):
        with self.client.post("/api/auth/login", json={"useroremail":"tester", "password":"root"}) as response: 
            print(response.raw)
            self.token = response.json()["token"]

    @task
    def rate_problem(self):
        self.client.post("/api/auth/interact", headers={ "Authorization": self.token }, json={
            "action": 4,
            "id": 2,
            "type": "PROBLEM_RATE"
        })  

    @task
    def like_problem(self):
        self.client.post("/api/auth/interact", headers={ "Authorization": self.token }, json={
            "action": "ADD",
            "id": 2,
            "type": "PROBLEM_LIKE"
        })  

