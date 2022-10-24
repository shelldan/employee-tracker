const Employee = require('../lib/employee')

class Finance extends Employee {
    constructor(first_name, last_name, employee_id, role_id, salary, title, manager_id){
        super(first_name,last_name,employee_id,role_id,salary)

        this.title = title;

        this.manager_id = manager_id;
    }
    
    getTitle(){
        return this.title;
    }

    getManagerId(){
        return this.manager_id;
    }

    getDepartment(){
        return 'Finance'
    }

    getDepartmentId(){
        return '3'
    }
}   


module.exports = Finance;