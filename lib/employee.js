class Employee {
    constructor(first_name, last_name, employee_id, role_id, salary){
        this.first_name = first_name;
        this.last_name = last_name;
        this.employee_id = employee_id;
        this.role_id = role_id;
        this.salary = salary;
    }

    getFirstName(){
        return this.first_name;
    }

    getLastName(){
        return this.last_name;
    }

    getRoleId(){
        return this.role_id;
    }

    getSalary(){
        return this.salary;
    }

}

module.exports = Employee;