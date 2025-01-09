// Import SVG icons
import horizontalIcon from './src/assets/icons/horizontal.svg'
import verticalIcon from './src/assets/icons/vertical.svg'
import addCustomIcon from './src/assets/icons/add-custom.svg'
import saveIcon from './src/assets/icons/save.svg'
import cancelIcon from './src/assets/icons/cancel.svg'
import fullscreenIcon from './src/assets/icons/fullscreen.svg'

// Get the split option buttons
const horizontalBtn = document.querySelector('.option-buttons button:first-child');
const verticalBtn = document.querySelector('.option-buttons button:last-child');
const splitViews = document.querySelectorAll('.split-view');

// Function to update split views
function updateSplitViews(isVertical) {
    splitViews.forEach(view => {
        if (isVertical) {
            view.style.flexDirection = 'column';
            view.querySelectorAll('div').forEach(div => {
                div.style.borderRight = 'none';
                div.style.borderBottom = '1px solid #E2E8F0';
            });
        } else {
            view.style.flexDirection = 'row';
            view.querySelectorAll('div').forEach(div => {
                div.style.borderBottom = 'none';
                div.style.borderRight = '1px solid #E2E8F0';
            });
        }
    });
}

// Add click event listeners
horizontalBtn.addEventListener('click', () => {
    horizontalBtn.classList.add('active');
    verticalBtn.classList.remove('active');
    updateSplitViews(false);
});

verticalBtn.addEventListener('click', () => {
    verticalBtn.classList.add('active');
    horizontalBtn.classList.remove('active');
    updateSplitViews(true);
});

// Custom Ratio Modal Functionality
const modal = document.getElementById('customRatioModal');
const addCustomBtn = document.querySelector('.add-custom');
const cancelBtn = document.querySelector('.cancel-btn');
const ratioForm = document.getElementById('ratioForm');
const saveBtn = document.querySelector('.save-btn');
const bottomControls = document.querySelector('.bottom-controls');
let editingElement = null;

addCustomBtn.addEventListener('click', () => {
    modal.style.display = 'flex';
    editingElement = null;
    ratioForm.reset();
    saveBtn.innerHTML = `<img src="${saveIcon}" alt="" class="icon save-icon"> Save Ratio`;
});

cancelBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    ratioForm.reset();
    editingElement = null;
});

function setupEditButton(testControl) {
    const editBtn = testControl.querySelector('.edit');
    editBtn.addEventListener('click', () => {
        editingElement = testControl;
        const name = testControl.querySelector('.test-info span:first-child').textContent;
        const [leftRatio, rightRatio] = testControl.querySelector('.ratio').textContent
            .split(':')[0].split('/').map(num => num.trim());
        
        document.getElementById('ratioName').value = name;
        document.getElementById('leftRatio').value = leftRatio;
        document.getElementById('rightRatio').value = rightRatio;
        
        modal.style.display = 'flex';
        saveBtn.innerHTML = `<img src="${saveIcon}" alt="" class="icon save-icon"> Update Ratio`;
    });
}

ratioForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('ratioName').value;
    const leftRatio = document.getElementById('leftRatio').value;
    const rightRatio = document.getElementById('rightRatio').value;
    const isVertical = verticalBtn.classList.contains('active');
    
    if (editingElement) {
        editingElement.querySelector('.test-info span:first-child').textContent = name;
        editingElement.querySelector('.ratio').textContent = `${leftRatio}/${rightRatio} (${isVertical ? 'vertical' : 'horizontal'})`;
        modal.style.display = 'none';
        ratioForm.reset();
        return;
    }
    
    // Create new test control
    const testControl = document.createElement('div');
    testControl.className = 'test-control';
    testControl.innerHTML = `
        <div class="test-info">
            <span>${name}</span>
            <span class="ratio">${leftRatio}/${rightRatio} (${isVertical ? 'vertical' : 'horizontal'})</span>
        </div>
        <div class="actions">
            <button class="edit">✎</button>
            <button class="delete">🗑</button>
        </div>
    `;
    
    // Add delete functionality
    testControl.querySelector('.delete').addEventListener('click', () => {
        testControl.remove();
    });
    
    setupEditButton(testControl);
    
    // Insert before fullscreen button
    const fullscreenBtn = document.querySelector('.fullscreen');
    bottomControls.insertBefore(testControl, fullscreenBtn);
    
    // Close modal and reset form
    modal.style.display = 'none';
    ratioForm.reset();
});