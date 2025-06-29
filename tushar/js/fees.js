// Fees Management
document.addEventListener('DOMContentLoaded', function() {
    loadFees();
});

function loadFees() {
    const fees = getData('feeRecords') || [];
    const tableBody = document.querySelector('#feesTable tbody');
    tableBody.innerHTML = '';
    
    if (fees.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="9" style="text-align: center;">No fee records found</td></tr>';
        return;
    }
    
    fees.forEach((fee, index) => {
        const balance = fee.amount - fee.paid;
        const status = balance <= 0 ? 'Paid' : 
                      new Date(fee.dueDate) < new Date() ? 'Overdue' : 'Pending';
        const statusClass = balance <= 0 ? 'status-paid' : 
                           new Date(fee.dueDate) < new Date() ? 'status-overdue' : 'status-pending';
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${fee.studentName}</td>
            <td>Class ${fee.studentClass}</td>
            <td>$${fee.amount.toFixed(2)}</td>
            <td>$${fee.paid.toFixed(2)}</td>
            <td>$${balance.toFixed(2)}</td>
            <td>${formatDate(fee.dueDate)}</td>
            <td><span class="status-badge ${statusClass}">${status}</span></td>
            <td class="action-btns">
                <button class="btn btn-primary" onclick="editFee(${index})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-danger" onclick="deleteFee(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

function addFee() {
    if (!validateForm('addFeeForm')) {
        showToast('Please fill all required fields', 'error');
        return;
    }
    
    const fee = {
        studentName: document.getElementById('feeStudentName').value,
        studentClass: document.getElementById('feeStudentClass').value,
        amount: parseFloat(document.getElementById('feeAmount').value),
        paid: parseFloat(document.getElementById('feePaid').value),
        dueDate: document.getElementById('feeDueDate').value
    };
    
    const fees = getData('feeRecords') || [];
    fees.push(fee);
    saveData('feeRecords', fees);
    
    closeModal('addFeeModal');
    loadFees();
    showToast('Fee record added successfully');
    
    // Reset form
    document.getElementById('addFeeForm').reset();
}

function editFee(index) {
    const fees = getData('feeRecords') || [];
    if (index >= fees.length) return;
    
    const fee = fees[index];
    document.getElementById('editFeeId').value = index;
    document.getElementById('editFeeStudentName').value = fee.studentName;
    document.getElementById('editFeeStudentClass').value = fee.studentClass;
    document.getElementById('editFeeAmount').value = fee.amount;
    document.getElementById('editFeePaid').value = fee.paid;
    document.getElementById('editFeeDueDate').value = fee.dueDate;
    
    openModal('editFeeModal');
}

function updateFee() {
    if (!validateForm('editFeeForm')) {
        showToast('Please fill all required fields', 'error');
        return;
    }
    
    const index = document.getElementById('editFeeId').value;
    const fees = getData('feeRecords') || [];
    
    if (index >= fees.length) return;
    
    fees[index] = {
        studentName: document.getElementById('editFeeStudentName').value,
        studentClass: document.getElementById('editFeeStudentClass').value,
        amount: parseFloat(document.getElementById('editFeeAmount').value),
        paid: parseFloat(document.getElementById('editFeePaid').value),
        dueDate: document.getElementById('editFeeDueDate').value
    };
    
    saveData('feeRecords', fees);
    closeModal('editFeeModal');
    loadFees();
    showToast('Fee record updated successfully');
}

function deleteFee(index) {
    if (!confirm('Are you sure you want to delete this fee record?')) return;
    
    const fees = getData('feeRecords') || [];
    if (index >= fees.length) return;
    
    fees.splice(index, 1);
    saveData('feeRecords', fees);
    loadFees();
    showToast('Fee record deleted successfully');
}