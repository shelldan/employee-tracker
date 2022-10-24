SELECT employees.employee_id, 
       employees.first_name, 
       employees.last_name,
       roles.title, 
       departments.department,
       roles.salary,
       employees.role_id, 
       employees.manager_id, 
       CONCAT(manager.first_name, ' ', manager.last_name) AS manager
FROM employees 
LEFT JOIN employees manager
ON manager.employee_id = employees.manager_id,
FROM employees
JOIN roles
ON employees.role_id = roles.role_id;