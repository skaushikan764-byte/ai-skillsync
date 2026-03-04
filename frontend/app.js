// AI SkillSync - Frontend Application
// Connects to FastAPI backend with Chart.js and D3.js visualizations

const API_BASE = 'http://localhost:8000/api';

// Chart.js instances
let readinessChart = null;
let weeklyHoursChart = null;
let skillProgressChart = null;
let focusChart = null;

// D3.js simulation
let simulation = null;

// ============================================================================
// Section Navigation
// ============================================================================

function showSection(sectionName) {
    // Hide all sections
    document.getElementById('dashboard-section').style.display = 'none';
    document.getElementById('skillgap-section').style.display = 'none';
    document.getElementById('skillgraph-section').style.display = 'none';
    document.getElementById('planner-section').style.display = 'none';
    document.getElementById('burnout-section').style.display = 'none';
    document.getElementById('simulation-section').style.display = 'none';

    // Show selected section
    const sectionMap = {
        'dashboard': 'dashboard-section',
        'skillgap': 'skillgap-section',
        'skillgraph': 'skillgraph-section',
        'planner': 'planner-section',
        'burnout': 'burnout-section',
        'simulation': 'simulation-section'
    };

    const sectionId = sectionMap[sectionName];
    if (sectionId) {
        document.getElementById(sectionId).style.display = 'block';
    }

    // Update tab active state
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');

    // Load data based on section
    if (sectionName === 'dashboard') {
        loadDashboard();
    } else if (sectionName === 'skillgap') {
        loadSkillGap();
    } else if (sectionName === 'skillgraph') {
        loadSkillGraph();
    } else if (sectionName === 'planner') {
        // Planner section ready for input
    } else if (sectionName === 'burnout') {
        // Burnout section ready for input
    } else if (sectionName === 'simulation') {
        // Simulation section ready for input
    }
}

// ============================================================================
// Dashboard Functions
// ============================================================================

async function loadDashboard() {
    const userId = document.getElementById('userId').value;
    const careerId = document.getElementById('careerId').value;

    try {
        // Load all dashboard data in parallel
        const [dashboardData, readinessData] = await Promise.all([
            fetch(`${API_BASE}/dashboard/${userId}`).then(r => r.json()),
            fetch(`${API_BASE}/readiness/${userId}/${careerId}`).then(r => r.json())
        ]);

        showSection('dashboard');
        document.getElementById('dashboard-section').style.display = 'grid';

        renderReadinessChart(readinessData);
        renderWeeklyHoursChart(dashboardData.weekly_hours);
        renderSkillProgressChart(dashboardData.skill_progress);
        renderFocusChart(dashboardData.focus_distribution);

    } catch (error) {
        console.error('Error loading dashboard:', error);
        alert('Failed to load dashboard. Make sure the backend is running on port 8000.');
    }
}

function renderReadinessChart(data) {
    const ctx = document.getElementById('readinessChart').getContext('2d');

    if (readinessChart) {
        readinessChart.destroy();
    }

    readinessChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Ready', 'Not Ready'],
            datasets: [{
                data: [data.readiness_score * 100, 100 - (data.readiness_score * 100)],
                backgroundColor: ['#6366f1', '#e5e7eb'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });

    document.getElementById('readinessScore').textContent = `${data.percentage.toFixed(1)}%`;
    document.getElementById('readinessLabel').textContent =
        `${data.career_title} - Skills Assessed: ${data.skills_assessed}`;
}

function renderWeeklyHoursChart(data) {
    const ctx = document.getElementById('weeklyHoursChart').getContext('2d');

    if (weeklyHoursChart) {
        weeklyHoursChart.destroy();
    }

    weeklyHoursChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.map(d => d.week),
            datasets: [{
                label: 'Study Hours',
                data: data.map(d => d.hours),
                backgroundColor: 'rgba(99, 102, 241, 0.8)',
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Hours'
                    }
                }
            }
        }
    });
}

function renderSkillProgressChart(data) {
    const ctx = document.getElementById('skillProgressChart').getContext('2d');

    if (skillProgressChart) {
        skillProgressChart.destroy();
    }

    skillProgressChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: data.map(d => d.skill_name),
            datasets: [{
                label: 'Skill Level',
                data: data.map(d => d.skill_level * 100),
                backgroundColor: 'rgba(16, 185, 129, 0.2)',
                borderColor: '#10b981',
                pointBackgroundColor: '#10b981',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: '#10b981'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        stepSize: 20
                    }
                }
            }
        }
    });
}

function renderFocusChart(data) {
    const ctx = document.getElementById('focusChart').getContext('2d');

    if (focusChart) {
        focusChart.destroy();
    }

    focusChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.map(d => d.range),
            datasets: [{
                label: 'Sessions',
                data: data.map(d => d.count),
                backgroundColor: [
                    'rgba(239, 68, 68, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(99, 102, 241, 0.8)',
                    'rgba(16, 185, 129, 0.8)'
                ],
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Count'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Focus Score Range'
                    }
                }
            }
        }
    });
}

// ============================================================================
// Skill Gap Functions
// ============================================================================

async function loadSkillGap() {
    const userId = document.getElementById('userId').value;
    const careerId = document.getElementById('careerId').value;

    try {
        const data = await fetch(`${API_BASE}/skill-gap/${userId}/${careerId}`)
            .then(r => r.json());

        document.getElementById('skillgap-section').style.display = 'block';

        // Render strong skills
        const strongList = document.getElementById('strongSkills');
        strongList.innerHTML = data.strong.map(skill =>
            `<li>${skill.skill_name} (${(skill.skill_level * 100).toFixed(0)}%)</li>`
        ).join('');

        // Render weak skills
        const weakList = document.getElementById('weakSkills');
        weakList.innerHTML = data.weak.map(skill =>
            `<li>${skill.skill_name} (${(skill.skill_level * 100).toFixed(0)}%)</li>`
        ).join('');

        // Render missing skills
        const missingList = document.getElementById('missingSkills');
        missingList.innerHTML = data.missing.map(skill =>
            `<li>${skill.skill_name}</li>`
        ).join('');

    } catch (error) {
        console.error('Error loading skill gap:', error);
    }
}

// ============================================================================
// Skill Graph Functions (D3.js)
// ============================================================================

async function loadSkillGraph() {
    const careerId = document.getElementById('careerId').value;

    try {
        const data = await fetch(`${API_BASE}/skill-graph/${careerId}`)
            .then(r => r.json());

        document.getElementById('skillgraph-section').style.display = 'block';

        renderD3Graph(data);

    } catch (error) {
        console.error('Error loading skill graph:', error);
    }
}

function renderD3Graph(data) {
    const container = document.getElementById('graphContainer');
    container.innerHTML = '';

    const width = container.clientWidth;
    const height = container.clientHeight;

    // Color scale based on node type
    const colorScale = {
        'subject': '#6366f1',
        'skill': '#10b981',
        'career': '#f59e0b'
    };

    // Create SVG
    const svg = d3.select('#graphContainer')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    // Create links
    const links = data.links.map(link => ({
        source: link.source,
        target: link.target,
        weight: link.weight
    }));

    // Create nodes with positions
    const nodes = data.nodes.map(node => ({
        ...node,
        x: width / 2 + (Math.random() - 0.5) * 200,
        y: height / 2 + (Math.random() - 0.5) * 200
    }));

    // Create force simulation
    simulation = d3.forceSimulation(nodes)
        .force('link', d3.forceLink(links).id(d => d.id).distance(100))
        .force('charge', d3.forceManyBody().strength(-300))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('collision', d3.forceCollide().radius(30));

    // Draw links
    const link = svg.append('g')
        .selectAll('line')
        .data(links)
        .enter()
        .append('line')
        .attr('class', 'link')
        .attr('stroke-width', d => Math.sqrt(d.weight) * 2);

    // Draw nodes
    const node = svg.append('g')
        .selectAll('.node')
        .data(nodes)
        .enter()
        .append('g')
        .attr('class', 'node')
        .call(d3.drag()
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragended));

    node.append('circle')
        .attr('r', d => d.type === 'career' ? 20 : (d.type === 'subject' ? 15 : 12))
        .attr('fill', d => colorScale[d.type] || '#6b7280');

    node.append('text')
        .text(d => d.label)
        .attr('dx', 15)
        .attr('dy', 4);

    // Add tooltips
    node.append('title')
        .text(d => `${d.label} (${d.type})`);

    // Update positions on each tick
    simulation.on('tick', () => {
        link
            .attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y);

        node.attr('transform', d => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
    }

    function dragged(event) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
    }

    function dragended(event) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
    }
}

// ============================================================================
// Study Planner Functions
// ============================================================================

async function generatePlan() {
    const userId = document.getElementById('userId').value;
    const careerId = document.getElementById('careerId').value;
    const examDays = document.getElementById('examDays').value;

    try {
        const response = await fetch(`${API_BASE}/generate-plan`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: parseInt(userId),
                career_id: parseInt(careerId),
                exam_days_left: parseInt(examDays),
                top_n: 5
            })
        });

        const data = await response.json();

        const planResults = document.getElementById('planResults');
        planResults.innerHTML = `
            <h4>Your Study Plan (${examDays} days remaining)</h4>
            ${data.tasks.map((task, index) => `
                <div class="task-item">
                    <div>
                        <div class="skill-name">${index + 1}. ${task.skill_name}</div>
                        <div class="reason">${task.reason}</div>
                        <div style="margin-top: 8px; font-size: 0.9rem;">
                            Current Level: ${(task.skill_level * 100).toFixed(0)}% | 
                            Weight: ${task.weight.toFixed(2)}
                        </div>
                    </div>
                    <span class="priority">Priority: ${(task.priority * 100).toFixed(0)}%</span>
                </div>
            `).join('')}

            <div style="margin-top: 20px; padding: 16px; background: #f3f4f6; border-radius: 8px;">
                <strong>Total Tasks:</strong> ${data.tasks.length} |
                <strong>Top Priority:</strong> ${data.tasks[0]?.skill_name || 'N/A'}
            </div>
        `;

    } catch (error) {
        console.error('Error generating plan:', error);
        alert('Failed to generate study plan');
    }
}

// ============================================================================
// Burnout Risk Functions
// ============================================================================

async function checkBurnout() {
    const userId = document.getElementById('userId').value;
    const sleepHours = parseFloat(document.getElementById('sleepHours').value);
    const studyHours = parseFloat(document.getElementById('studyHours').value);
    const focusScore = parseFloat(document.getElementById('focusScore').value);

    try {
        const response = await fetch(`${API_BASE}/burnout-risk`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: parseInt(userId),
                sleep_hours: sleepHours,
                study_hours: studyHours,
                focus_score: focusScore
            })
        });

        const data = await response.json();

        const resultDiv = document.getElementById('burnoutResult');
        resultDiv.className = data.risk_level.toLowerCase();
        resultDiv.innerHTML = `
            <div class="risk-score">${(data.risk_score * 100).toFixed(0)}%</div>
            <div class="risk-level">${data.risk_level} Risk</div>
            <div class="advice">${data.advice}</div>
        `;

    } catch (error) {
        console.error('Error checking burnout:', error);
        alert('Failed to assess burnout risk');
    }
}

// ============================================================================
// Digital Twin Simulation Functions
// ============================================================================

async function simulateScore() {
    const studyHours = parseFloat(document.getElementById('simStudyHours').value);
    const focus = parseFloat(document.getElementById('simFocus').value);
    const revision = parseInt(document.getElementById('simRevision').value);

    try {
        const response = await fetch(`${API_BASE}/simulate-score`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                study_hours: studyHours,
                focus_score: focus,
                revision_frequency: revision
            })
        });

        const data = await response.json();

        const resultDiv = document.getElementById('simulationResult');
        resultDiv.innerHTML = `
            <div class="predicted-score">${data.predicted_score.toFixed(1)}%</div>
            <div>Predicted Score</div>
            <div style="margin-top: 16px; opacity: 0.9;">
                ${data.confidence_note}
            </div>
            <div style="margin-top: 12px; font-size: 0.9rem; opacity: 0.8;">
                Input: ${studyHours}h study, ${focus}% focus, ${revision}x revision/week
            </div>
        `;

    } catch (error) {
        console.error('Error simulating score:', error);
        alert('Failed to simulate score. Make sure the prediction engine is initialized.');
    }
}

// ============================================================================
// Initialize
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    // Load default data on page load
    console.log('AI SkillSync Frontend loaded');
    console.log('API Base URL:', API_BASE);
});
