( async function () {
    const data = await fetch("./data.json");
    const res = await data.json();
    
    let employees  = res;
    let selectedEmployeeId = employees[0].id;
    let selectedEmployee = employees[0];

    const employeeList = document.querySelector(".employees__name--list");
    const employeeInfo = document.querySelector(".employees__single--info");
    

    //add employee logic
    const createEmployee = document.querySelector(".addemp");
    const addEmployeeModal = document.querySelector(".addEmployee");
    const addEmployeeForm = document.querySelector(".addEmployee__create");
    
    createEmployee.addEventListener("click", () => {
        addEmployeeModal.style.display = "flex";
    });

    addEmployeeModal.addEventListener("click", (e) => {
        if(e.target.className === "addEmployee"){ 
        addEmployeeModal.style.display = "none";
        }
    });
    const dobInput = document.querySelector(".addEmployee__create--dob");
    dobInput.max = `${
        new Date().getFullYear() - 18
    }-${new Date().toISOString().slice(5,10)}`;
    //--submit button logic --//
    addEmployeeForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const formData = new FormData(addEmployeeForm);
        const values = [...formData.entries()];
       
        let empData = {};
        values.forEach((val) => {
            empData[val[0]] = val[1];
        });

        empData.id = employees[employees.length -1].id + 1;
        empData.age = new Date().getFullYear() - parseInt(empData.dob.slice(0,4),10);

        empData.imageurl = empData.imageurl || "https://cdn.pixabay.com/photo/2015/04/23/22/00/new-year-background-736885_1280.jpg";

        employees.push(empData);
        renderEmployees();
        addEmployeeForm.reset();
        addEmployeeModal.style.display = "none";
});

    //selected employee logic

    employeeList.addEventListener("click", (e) => {
        if(e.target.tagName === "SPAN" && selectedEmployeeId !== e.target.id){
            selectedEmployeeId = Number(e.target.id); //---
            renderEmployees();
            renderSingleEmployee();
            
        }
// deleted employee logic
        if(e.target.tagName === "I") {
            employees = employees.filter(
                (emp) => String(emp.id) !== e.target.parentNode.id
            );
            if (String(selectedEmployeeId) === e.target.parentNode.id) {
                selectedEmployeeId = employees[0]?.id || -1;
                selectedEmployee = employees[0] || {};
                renderSingleEmployee();
            }
            renderEmployees();
            
        }
    }); 

    //render employee list
    const renderEmployees  = () => {
        employeeList.innerHTML = "";
        employees.forEach((emp) =>{
            const employee = document.createElement("span");
            employee.classList.add("employees__name--item");

            if (parseInt(selectedEmployeeId, 10) === emp.id) {
                employee.classList.add("selected");
                selectedEmployee = emp;
            }
            employee.setAttribute("id",emp.id);
            employee.innerHTML = `${emp.firstname} ${emp.lastname} <i class="empDelete">❌</i>`;

            employeeList.appendChild(employee);
        });
    };

    //render single employee 
    const renderSingleEmployee = () => {
        if (selectedEmployeeId === -1){
            employeeInfo.innerHTML ="";
            return;
        }
        if (!selectedEmployee) return;  // Prevent errors if undefined
    
        employeeInfo.innerHTML = `
            <img src="${selectedEmployee.imageurl || 'default.jpg'}" alt="${selectedEmployee.firstname}">
            <span class="employees__single--heading">
                ${selectedEmployee.firstname} ${selectedEmployee.lastname} (${selectedEmployee.age})
            </span>
            <span>${selectedEmployee.address}</span>
            <span>${selectedEmployee.email}</span>
            <span>Mobile - ${selectedEmployee.contactNumber}</span>
            <span>DOB - ${selectedEmployee.dob}</span>
        `;
    };
    
    renderEmployees(); 
    if(parseInt(selectedEmployee)) renderSingleEmployee();

    
})()