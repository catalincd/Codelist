from locust import HttpUser, task, between
import json

class RunnerUser(HttpUser):
    wait_time = between(5, 10)

    def __init__(self, parent):
        super(RunnerUser, self).__init__(parent)
        self.token = ""

    def on_start(self):
        with self.client.post("/api/auth/login", json={"useroremail":"tester", "password":"root"}) as response: 
            print(response.raw)
            self.token = response.json()["token"]

    @task
    def run_cpp_code(self):
        self.client.put("/api/solutions/run", headers={ "Authorization": self.token }, json={
            "language": "cpp",
            "source": [
                {
                    "name": "main.cpp",
                    "code": "#include<iostream>\n#include<fstream>\nusing namespace std;ofstream fout(\"output.txt\");int main(){std::cout<<\"120\"<<std::endl;fout<<\"120\"<<std::endl;fout.close();return 0;}"
                }
            ] 
        })  

    @task
    def run_python_code(self):
        self.client.put("/api/solutions/run", headers={ "Authorization": self.token }, json={
            "language": "py",
            "source": [
                {
                    "name": "main.py",
                    "code": "print(120)"
                }
            ] 
        })  

    @task
    def run_js_code(self):
        self.client.put("/api/solutions/run", headers={ "Authorization": self.token }, json={
            "language": "js",
            "source": [
                {
                    "name": "main.js",
                    "code": "console.log()"
                }
            ] 
        })  

    @task
    def run_error_code(self):
        self.client.put("/api/solutions/run", headers={ "Authorization": self.token }, json={
            "language": "cpp",
            "source": [
                {
                    "name": "main.cpp",
                    "code": "#include<iostream>\nint main((((()))))}}}}"
                }
            ] 
        }) 
