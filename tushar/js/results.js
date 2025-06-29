// Results Management
document.addEventListener('DOMContentLoaded', function() {
    loadResults();
});

function loadResults() {
    const results = getData('results') || [];
    const tableBody = document.querySelector('#resultsTable tbody');
    tableBody.innerHTML = '';
    
    if (results.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7" style="text-align: center;">No results found</td></tr>';
        return;
    }
    
    results.forEach((result, index) => {
        const grade = calculateGrade(result.marks);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${result.studentName}</td>
            <td>Class ${result.studentClass}</td>
            <td>${result.subject}</td>
            <td>${result.marks}</td>
            <td>${grade}</td>
            <td class="action-btns">
                <button class="btn btn-primary" onclick="editResult(${index})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-danger" onclick="deleteResult(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function calculateGrade(marks) {
    if (marks >= 90) return 'A+';
    if (marks >= 80) return 'A';
    if (marks >= 70) return 'B';
    if (marks >= 60) return 'C';
    if (marks >= 50) return 'D';
    return 'F';
}

function addResult() {
    if (!validateForm('addResultForm')) {
        showToast('Please fill all required fields', 'error');
        return;
    }
    
    const result = {
        studentName: document.getElementById('studentName').value,
        studentClass: document.getElementById('studentClass').value,
        subject: document.getElementById('subject').value,
        marks: document.getElementById('marks').value
    };
    
    const results = getData('results') || [];
    results.push(result);
    saveData('results', results);
    
    closeModal('addResultModal');
    loadResults();
    showToast('Result added successfully');
    
    // Reset form
    document.getElementById('addResultForm').reset();
}

function editResult(index) {
    const results = getData('results') || [];
    if (index >= results.length) return;
    
    const result = results[index];
    document.getElementById('editResultId').value = index;
    document.getElementById('editStudentName').value = result.studentName;
    document.getElementById('editStudentClass').value = result.studentClass;
    document.getElementById('editSubject').value = result.subject;
    document.getElementById('editMarks').value = result.marks;
    
    openModal('editResultModal');
}

function updateResult() {
    if (!validateForm('editResultForm')) {
        showToast('Please fill all required fields', 'error');
        return;
    }
    
    const index = document.getElementById('editResultId').value;
    const results = getData('results') || [];
    
    if (index >= results.length) return;
    
    results[index] = {
        studentName: document.getElementById('editStudentName').value,
        studentClass: document.getElementById('editStudentClass').value,
        subject: document.getElementById('editSubject').value,
        marks: document.getElementById('editMarks').value
    };
    
    saveData('results', results);
    closeModal('editResultModal');
    loadResults();
    showToast('Result updated successfully');
}

function deleteResult(index) {
    if (!confirm('Are you sure you want to delete this result?')) return;
    
    const results = getData('results') || [];
    if (index >= results.length) return;
    
    results.splice(index, 1);
    saveData('results', results);
    loadResults();
    showToast('Result deleted successfully');
}