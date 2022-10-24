SELECT employee_id, first_name, last_name, role_id, manager_id
FROM employees AS Employee
JOIN employees AS Manager
ON Employee.manager_id = Manager.employee_id