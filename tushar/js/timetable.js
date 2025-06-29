   // Constants
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
        const periods = ['Period 1', 'Period 2', 'Period 3', 'Period 4', 'Period 5', 'Period 6'];
        
        // Initialize when DOM is loaded
        document.addEventListener('DOMContentLoaded', function() {
            loadTimetables();
            initializeTimetableGrid('timetableGrid');
        });
        
        // Initialize timetable grid
        function initializeTimetableGrid(gridId) {
            const grid = document.getElementById(gridId);
            grid.innerHTML = '';
            
            // Create header row
            const headerRow = document.createElement('div');
            headerRow.className = 'timetable-row timetable-header';
            
            const emptyCell = document.createElement('div');
            emptyCell.className = 'timetable-cell';
            headerRow.appendChild(emptyCell);
            
            days.forEach(day => {
                const dayCell = document.createElement('div');
                dayCell.className = 'timetable-cell';
                dayCell.textContent = day;
                headerRow.appendChild(dayCell);
            });
            
            grid.appendChild(headerRow);
            
            // Create period rows
            periods.forEach(period => {
                const periodRow = document.createElement('div');
                periodRow.className = 'timetable-row';
                
                const periodCell = document.createElement('div');
                periodCell.className = 'timetable-cell timetable-period';
                periodCell.textContent = period;
                periodRow.appendChild(periodCell);
                
                days.forEach(day => {
                    const subjectCell = document.createElement('div');
                    subjectCell.className = 'timetable-cell';
                    
                    const subjectInput = document.createElement('input');
                    subjectInput.type = 'text';
                    subjectInput.placeholder = 'Subject';
                    subjectInput.setAttribute('data-day', day);
                    subjectInput.setAttribute('data-period', period);
                    
                    subjectCell.appendChild(subjectInput);
                    periodRow.appendChild(subjectCell);
                });
                
                grid.appendChild(periodRow);
            });
        }
        
        // Load timetable data into grid
        function loadTimetableToGrid(gridId, timetableData) {
            const inputs = document.querySelectorAll(`#${gridId} input[type="text"]`);
            inputs.forEach(input => {
                const day = input.getAttribute('data-day');
                const period = input.getAttribute('data-period');
                
                if (timetableData && timetableData[day] && timetableData[day][period]) {
                    input.value = timetableData[day][period];
                } else {
                    input.value = '';
                }
            });
        }
        
        // Get timetable data from grid
        function getTimetableFromGrid(gridId) {
            const timetableData = {};
            days.forEach(day => {
                timetableData[day] = {};
            });
            
            const inputs = document.querySelectorAll(`#${gridId} input[type="text"]`);
            inputs.forEach(input => {
                const day = input.getAttribute('data-day');
                const period = input.getAttribute('data-period');
                timetableData[day][period] = input.value;
            });
            
            return timetableData;
        }
        
        // Load all timetables
        function loadTimetables() {
            const timetables = getData('classTimetables') || [];
            const container = document.getElementById('timetablesContainer');
            container.innerHTML = '';
            
            if (timetables.length === 0) {
                container.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">No timetables found</p>';
                return;
            }
            
            timetables.forEach((timetable, index) => {
                const timetableCard = document.createElement('div');
                timetableCard.className = 'timetable-card';
                
                const cardHeader = document.createElement('div');
                cardHeader.className = 'timetable-card-header';
                cardHeader.innerHTML = `
                    <h4>Class ${timetable.class} - Section ${timetable.section}</h4>
                    <div class="action-btns">
                        <button class="btn btn-primary" onclick="editTimetable(${index})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-danger" onclick="deleteTimetable(${index})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `;
                
                const cardBody = document.createElement('div');
                cardBody.className = 'timetable-card-body';
                
                // Create a mini timetable view
                const miniTable = document.createElement('table');
                miniTable.className = 'mini-timetable';
                
                // Header row
                const headerRow = document.createElement('tr');
                headerRow.innerHTML = '<th>Period</th>' + days.map(day => `<th>${day.substring(0, 3)}</th>`).join('');
                miniTable.appendChild(headerRow);
                
                // Period rows
                periods.forEach(period => {
                    const row = document.createElement('tr');
                    const periodCell = document.createElement('td');
                    periodCell.textContent = period.replace('Period ', 'P');
                    row.appendChild(periodCell);
                    
                    days.forEach(day => {
                        const subjectCell = document.createElement('td');
                        const entry = timetable.timetable[day]?.[period] || '';
                        // Display just the subject name (before parenthesis if exists)
                        subjectCell.textContent = entry.split(' (')[0].substring(0, 10) || '-';
                        row.appendChild(subjectCell);
                    });
                    
                    miniTable.appendChild(row);
                });
                
                cardBody.appendChild(miniTable);
                timetableCard.appendChild(cardHeader);
                timetableCard.appendChild(cardBody);
                container.appendChild(timetableCard);
            });
        }
        
        // Filter timetables by class
        function filterTimetables() {
            const classFilter = document.getElementById('classFilter').value;
            const timetables = getData('classTimetables') || [];
            const container = document.getElementById('timetablesContainer');
            container.innerHTML = '';
            
            if (timetables.length === 0) {
                container.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">No timetables found</p>';
                return;
            }
            
            const filteredTimetables = classFilter ? 
                timetables.filter(t => t.class === classFilter) : 
                timetables;
            
            if (filteredTimetables.length === 0) {
                container.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">No timetables match the selected class</p>';
                return;
            }
            
            filteredTimetables.forEach((timetable, index) => {
                // Find the original index in case of filtering
                const originalIndex = timetables.findIndex(t => 
                    t.class === timetable.class && t.section === timetable.section);
                
                const timetableCard = document.createElement('div');
                timetableCard.className = 'timetable-card';
                
                const cardHeader = document.createElement('div');
                cardHeader.className = 'timetable-card-header';
                cardHeader.innerHTML = `
                    <h4>Class ${timetable.class} - Section ${timetable.section}</h4>
                    <div class="action-btns">
                        <button class="btn btn-primary" onclick="editTimetable(${originalIndex})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-danger" onclick="deleteTimetable(${originalIndex})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `;
                
                const cardBody = document.createElement('div');
                cardBody.className = 'timetable-card-body';
                
                // Create a mini timetable view
                const miniTable = document.createElement('table');
                miniTable.className = 'mini-timetable';
                
                // Header row
                const headerRow = document.createElement('tr');
                headerRow.innerHTML = '<th>Period</th>' + days.map(day => `<th>${day.substring(0, 3)}</th>`).join('');
                miniTable.appendChild(headerRow);
                
                // Period rows
                periods.forEach(period => {
                    const row = document.createElement('tr');
                    const periodCell = document.createElement('td');
                    periodCell.textContent = period.replace('Period ', 'P');
                    row.appendChild(periodCell);
                    
                    days.forEach(day => {
                        const subjectCell = document.createElement('td');
                        const entry = timetable.timetable[day]?.[period] || '';
                        subjectCell.textContent = entry.split(' (')[0].substring(0, 10) || '-';
                        row.appendChild(subjectCell);
                    });
                    
                    miniTable.appendChild(row);
                });
                
                cardBody.appendChild(miniTable);
                timetableCard.appendChild(cardHeader);
                timetableCard.appendChild(cardBody);
                container.appendChild(timetableCard);
            });
        }
        
        // Helper functions for localStorage
        function getData(key) {
            try {
                return JSON.parse(localStorage.getItem(key)) || [];
            } catch (e) {
                return [];
            }
        }
        
        function setData(key, value) {
            localStorage.setItem(key, JSON.stringify(value));
        }
        
        // Open timetable modal
        function openTimetableModal() {
            document.getElementById('modalTitle').textContent = 'Add New Timetable';
            document.getElementById('timetableForm').reset();
            document.getElementById('timetableForm').removeAttribute('data-edit-index');
            initializeTimetableGrid('timetableGrid');
            document.getElementById('timetableModal').style.display = 'block';
        }
        
        // Edit timetable
        function editTimetable(index) {
            const timetables = getData('classTimetables') || [];
            if (index < 0 || index >= timetables.length) return;
            const timetable = timetables[index];
            document.getElementById('classInput').value = timetable.class;
            document.getElementById('sectionInput').value = timetable.section;
            loadTimetableToGrid('timetableGrid', timetable.timetable);
            document.getElementById('timetableForm').setAttribute('data-edit-index', index);
            document.getElementById('modalTitle').textContent = `Edit Timetable - Class ${timetable.class} Section ${timetable.section}`;
            document.getElementById('timetableModal').style.display = 'block';
        }
        
        // Delete timetable
        function deleteTimetable(index) {
            if (!confirm('Are you sure you want to delete this timetable?')) return;
            const timetables = getData('classTimetables') || [];
            if (index < 0 || index >= timetables.length) return;
            timetables.splice(index, 1);
            setData('classTimetables', timetables);
            loadTimetables();
        }
        
        // Save timetable (add or update)
        function saveTimetable(event) {
            event.preventDefault();
            const classValue = document.getElementById('classInput').value.trim();
            const sectionValue = document.getElementById('sectionInput').value.trim();
            if (!classValue || !sectionValue) {
                alert('Please enter class and section.');
                return;
            }
            
            const timetableData = getTimetableFromGrid('timetableGrid');
            let timetables = getData('classTimetables') || [];
            const editIndex = document.getElementById('timetableForm').getAttribute('data-edit-index');
            
            if (editIndex !== null && editIndex !== '') {
                // Update existing
                timetables[editIndex] = {
                    class: classValue,
                    section: sectionValue,
                    timetable: timetableData
                };
            } else {
                // Check if timetable for this class-section already exists
                const exists = timetables.some(t => 
                    t.class === classValue && t.section === sectionValue);
                
                if (exists) {
                    alert('A timetable for this class and section already exists.');
                    return;
                }
                
                // Add new
                timetables.push({
                    class: classValue,
                    section: sectionValue,
                    timetable: timetableData
                });
            }
            
            setData('classTimetables', timetables);
            loadTimetables();
            closeTimetableModal();
        }
        
        // Close timetable modal
        function closeTimetableModal() {
            document.getElementById('timetableModal').style.display = 'none';
        }
        
        // Tab navigation
        function openTab(tabId) {
            // Hide all tab contents
            document.querySelectorAll('.tab-content').forEach(tab => {
                tab.classList.remove('active');
            });
            
            // Deactivate all tab buttons
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Activate selected tab
            document.getElementById(tabId).classList.add('active');
            event.currentTarget.classList.add('active');
        }
        
        // Teacher assignment service
        function assignTeacher() {
            const day = document.getElementById('teacherDaySelect').value;
            const period = document.getElementById('teacherPeriodSelect').value;
            const teacherName = document.getElementById('teacherNameInput').value.trim();
            
            if (!teacherName) {
                alert('Please enter teacher name');
                return;
            }
            
            const input = document.querySelector(`#timetableGrid input[data-day="${day}"][data-period="${period}"]`);
            if (!input) return;
            
            let currentValue = input.value;
            
            // Remove existing teacher assignment if any
            if (currentValue.includes('(')) {
                currentValue = currentValue.split(' (')[0].trim();
            }
            
            // Add new teacher assignment
            input.value = currentValue + (currentValue ? ' ' : '') + `(${teacherName})`;
            document.getElementById('teacherNameInput').value = '';
        }
        
        // Room allocation service
        function assignRoom() {
            const day = document.getElementById('roomDaySelect').value;
            const period = document.getElementById('roomPeriodSelect').value;
            const roomNumber = document.getElementById('roomNumberInput').value.trim();
            
            if (!roomNumber) {
                alert('Please enter room number');
                return;
            }
            
            const input = document.querySelector(`#timetableGrid input[data-day="${day}"][data-period="${period}"]`);
            if (!input) return;
            
            let currentValue = input.value;
            
            // Remove existing room assignment if any
            if (currentValue.includes('[')) {
                currentValue = currentValue.split(' [')[0].trim();
            }
            
            // Add new room assignment
            input.value = currentValue + (currentValue ? ' ' : '') + `[${roomNumber}]`;
            document.getElementById('roomNumberInput').value = '';
        }
        
        // Conflict check service
        function checkConflicts() {
            const timetables = getData('classTimetables') || [];
            const teacherAssignments = {};
            let conflicts = [];
            
            timetables.forEach(timetable => {
                days.forEach(day => {
                    periods.forEach(period => {
                        const entry = timetable.timetable[day]?.[period] || '';
                        if (entry.includes('(') && entry.includes(')')) {
                            const teacherMatch = entry.match(/\(([^)]+)\)/);
                            if (teacherMatch) {
                                const teacher = teacherMatch[1];
                                const key = `${day}-${period}-${teacher}`;
                                
                                if (teacherAssignments[key]) {
                                    conflicts.push({
                                        type: 'teacher',
                                        teacher,
                                        day,
                                        period,
                                        class1: teacherAssignments[key].class,
                                        section1: teacherAssignments[key].section,
                                        class2: timetable.class,
                                        section2: timetable.section
                                    });
                                } else {
                                    teacherAssignments[key] = {
                                        class: timetable.class,
                                        section: timetable.section
                                    };
                                }
                            }
                        }
                    });
                });
            });
            
            displayConflicts(conflicts);
        }
        
        // Display conflicts
        function displayConflicts(conflicts) {
            const resultsDiv = document.getElementById('conflictResults');
            resultsDiv.innerHTML = '';
            
            if (conflicts.length === 0) {
                resultsDiv.innerHTML = '<p>No conflicts found!</p>';
                return;
            }
            
            const conflictList = document.createElement('ul');
            conflictList.className = 'conflict-list';
            
            conflicts.forEach(conflict => {
                const conflictItem = document.createElement('li');
                conflictItem.className = 'conflict-item';
                
                if (conflict.type === 'teacher') {
                    conflictItem.innerHTML = `
                        <strong>Teacher Conflict:</strong> ${conflict.teacher} is assigned to both:<br>
                        - Class ${conflict.class1} Section ${conflict.section1}<br>
                        - Class ${conflict.class2} Section ${conflict.section2}<br>
                        <strong>Time:</strong> ${conflict.day}, ${conflict.period}
                    `;
                }
                
                conflictList.appendChild(conflictItem);
            });
            
            resultsDiv.appendChild(conflictList);
        }