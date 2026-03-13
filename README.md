Лаб. робота №2

як запустити:

```bash
   npm install

    npm run dev

Приклади запитів (cURL)

curl -i "http://localhost:6060/api/tickets"

curl -i "http://localhost:6060/api/tickets?status=Bug&sortBy=priority&sortDir=desc"
статуси які можна міняти: Bug || Question || Blocker || offer

curl -i http://localhost:6060/api/tickets/ВАШ_ID_ЗАЯВКИ

create:

curl -i -X POST http://localhost:6060/api/tickets \
-H "Content-Type: application/json" \
-d '{
  "theme": "Проблема з Wi-Fi",
  "status": "Bug",
  "priority": "high",
  "comment": "Не можу підключитися до мережі в 3-му гуртожитку.",
  "username": "Іван Петренко"
}'

update:

curl -i -X PUT http://localhost:6060/api/tickets/ВАШ_ID_ЗАЯВКИ \
-H "Content-Type: application/json" \
-d '{
  "status": "Closed",
  "comment": "Проблему вирішено, дякую!"
}'

delete:

curl -i -X DELETE http://localhost:6060/api/tickets/ВАШ_ID_ЗАЯВКИ

create user:

curl -i -X POST http://localhost:6060/api/users \
-H "Content-Type: application/json" \
-d '{
  "userFullName": "Марія Коваленко",
  "userEmail": "maria@student.edu.ua",
  "userCourse": 2
}'

search user:

curl -i "http://localhost:6060/api/users?search=Марія"
```
