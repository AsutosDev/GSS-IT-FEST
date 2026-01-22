// State Management
const state = {
    currentStep: 1,
    darkMode: false,
    formData: {
        fullName: '',
        dateOfBirth: '',
        dateOfBirthBS: '',
        gender: '',
        documentType: '',
        documentNumber: '',
        documentFront: null,
        documentBack: null,
        selfieImage: null,
        currentAddress: {
            province: '',
            district: '',
            municipality: '',
            ward: '',
            tole: ''
        },
        permanentAddress: {
            province: '',
            district: '',
            municipality: '',
            ward: '',
            tole: ''
        },
        sameAsCurrentAddress: false
    },
    errors: {},
    previewUrls: {
        documentFront: null,
        documentBack: null,
        selfieImage: null
    }
};

// Constants
const provinces = [
    'Province 1', 'Madhesh Pradesh', 'Bagmati Pradesh', 'Gandaki Pradesh',
    'Lumbini Pradesh', 'Karnali Pradesh', 'Sudurpashchim Pradesh'
];

const documentTypes = [
    { value: 'citizenship', label: 'नागरिकता (Citizenship)' },
    { value: 'passport', label: 'राहदानी (Passport)' },
    { value: 'license', label: 'सवारी चालक अनुमतिपत्र (Driving License)' }
];

// Validation Functions
function validateName(name) {
    const trimmedName = name.trim();
    // Must be at least 3 characters, contain at least 2 words, only letters and spaces
    const nameRegex = /^[a-zA-Z]+([\s][a-zA-Z]+)+$/;
    const minLength = trimmedName.length >= 3;
    const noNumbers = !/\d/.test(trimmedName);
    const validPattern = nameRegex.test(trimmedName);

    return minLength && noNumbers && validPattern;
}

function validateAddress(address) {
    const trimmedAddress = address.trim();
    // Must be at least 2 characters, only letters and spaces, no numbers
    const addressRegex = /^[a-zA-Z\s]{2,50}$/;
    const noNumbers = !/\d/.test(trimmedAddress);
    const validPattern = addressRegex.test(trimmedAddress);

    return validPattern && noNumbers && trimmedAddress.length >= 2;
}

function validateWardNumber(ward) {
    const wardNum = parseInt(ward, 10);
    return !isNaN(wardNum) && wardNum >= 1 && wardNum <= 99 && ward === wardNum.toString();
}

function validateBSDate(date) {
    const bsDateRegex = /^(19[0-9]{2}|20[0-9]{2})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[0-2])$/;
    if (!bsDateRegex.test(date)) return false;

    // Additional validation for year range
    const [year, month, day] = date.split('-').map(Number);
    if (year < 1900 || year > 2100) return false;
    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 32) return false;

    return true;
}

function validateImageFile(file) {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
        return 'Only JPG, JPEG, and PNG files are allowed';
    }
    if (file.size > maxSize) {
        return 'File size must be less than 5MB';
    }
    return null;
}

function validateStep(step) {
    const newErrors = {};

    if (step === 1) {
        if (!state.formData.fullName.trim()) {
            newErrors.fullName = 'Full name is required';
        } else if (!validateName(state.formData.fullName)) {
            newErrors.fullName = 'Please enter full name (first and last name, letters only, min 3 characters)';
        }

        if (!state.formData.dateOfBirth) {
            newErrors.dateOfBirth = 'Date of birth (AD) is required';
        }

        if (!state.formData.dateOfBirthBS) {
            newErrors.dateOfBirthBS = 'Date of birth (BS) is required';
        } else if (!validateBSDate(state.formData.dateOfBirthBS)) {
            newErrors.dateOfBirthBS = 'BS date format should be YYYY-MM-DD (e.g., 2055-05-15)';
        }

        if (!state.formData.gender) newErrors.gender = 'Gender is required';
        if (!state.formData.currentAddress.province) newErrors['currentAddress.province'] = 'Province is required';

        if (!state.formData.currentAddress.district.trim()) {
            newErrors['currentAddress.district'] = 'District is required';
        } else if (!validateAddress(state.formData.currentAddress.district)) {
            newErrors['currentAddress.district'] = 'Please enter a valid district name (letters only, min 2 characters)';
        }

        if (!state.formData.currentAddress.municipality.trim()) {
            newErrors['currentAddress.municipality'] = 'Municipality is required';
        } else if (!validateAddress(state.formData.currentAddress.municipality)) {
            newErrors['currentAddress.municipality'] = 'Please enter a valid municipality name (letters only, min 2 characters)';
        }

        if (!state.formData.currentAddress.ward) {
            newErrors['currentAddress.ward'] = 'Ward number is required';
        } else if (!validateWardNumber(state.formData.currentAddress.ward)) {
            newErrors['currentAddress.ward'] = 'Ward number must be between 1 and 99';
        }

        if (state.formData.currentAddress.tole && !validateAddress(state.formData.currentAddress.tole)) {
            newErrors['currentAddress.tole'] = 'Please enter a valid tole/street name (letters only)';
        }
    }

    if (step === 2) {
        if (!state.formData.documentType) newErrors.documentType = 'Please select a document type';
        if (!state.formData.documentNumber.trim()) newErrors.documentNumber = 'Document number is required';
        if (!state.formData.documentFront) {
            newErrors.documentFront = 'Front image is required';
        }
        if (state.formData.documentType !== 'passport' && !state.formData.documentBack) {
            newErrors.documentBack = 'Back image is required';
        }
    }

    if (step === 3) {
        if (!state.formData.selfieImage) {
            newErrors.selfieImage = 'Selfie verification is required';
        }

        if (!state.formData.sameAsCurrentAddress) {
            if (!state.formData.permanentAddress.province) {
                newErrors['permanentAddress.province'] = 'Province is required';
            }

            if (!state.formData.permanentAddress.district.trim()) {
                newErrors['permanentAddress.district'] = 'District is required';
            } else if (!validateAddress(state.formData.permanentAddress.district)) {
                newErrors['permanentAddress.district'] = 'Please enter a valid district name (letters only, min 2 characters)';
            }

            if (!state.formData.permanentAddress.municipality.trim()) {
                newErrors['permanentAddress.municipality'] = 'Municipality is required';
            } else if (!validateAddress(state.formData.permanentAddress.municipality)) {
                newErrors['permanentAddress.municipality'] = 'Please enter a valid municipality name (letters only, min 2 characters)';
            }

            if (!state.formData.permanentAddress.ward) {
                newErrors['permanentAddress.ward'] = 'Ward number is required';
            } else if (!validateWardNumber(state.formData.permanentAddress.ward)) {
                newErrors['permanentAddress.ward'] = 'Ward number must be between 1 and 99';
            }

            if (state.formData.permanentAddress.tole && !validateAddress(state.formData.permanentAddress.tole)) {
                newErrors['permanentAddress.tole'] = 'Please enter a valid tole/street name (letters only)';
            }
        }
    }

    state.errors = newErrors;
    return Object.keys(newErrors).length === 0;
}

// Event Handlers
function handleInputChange(e) {
    const { name, value, type, checked } = e.target;

    if (name.includes('.')) {
        const [parent, child] = name.split('.');
        state.formData[parent][child] = value;
    } else if (type === 'checkbox') {
        state.formData[name] = checked;
        if (name === 'sameAsCurrentAddress' && checked) {
            state.formData.permanentAddress = { ...state.formData.currentAddress };
            render(); // Only render when checkbox changes
        }
    } else {
        state.formData[name] = value;
    }

    if (state.errors[name]) {
        delete state.errors[name];
    }

    // Don't render on every input to allow multi-character typing
    // Rendering only happens on change events (blur/select change)
}

function handleFileUpload(e, fieldName) {
    const file = e.target.files[0];
    if (file) {
        const validationError = validateImageFile(file);
        if (validationError) {
            state.errors[fieldName] = validationError;
            render();
            return;
        }

        state.formData[fieldName] = file;

        const reader = new FileReader();
        reader.onloadend = () => {
            state.previewUrls[fieldName] = reader.result;
            render();
        };
        reader.readAsDataURL(file);

        if (state.errors[fieldName]) {
            delete state.errors[fieldName];
        }
    }
}

function handleRemoveFile(fieldName) {
    state.formData[fieldName] = null;
    state.previewUrls[fieldName] = null;
    render();
}

function handleNext() {
    if (validateStep(state.currentStep)) {
        state.currentStep = Math.min(state.currentStep + 1, 4);
        render();
    } else {
        render();
    }
}

function handleBack() {
    state.currentStep = Math.max(state.currentStep - 1, 1);
    render();
}

function handleSubmit() {
    if (validateStep(3)) {
        state.currentStep = 4;
        console.log('Form submitted:', state.formData);
        render();
    } else {
        render();
    }
}

function toggleDarkMode() {
    state.darkMode = !state.darkMode;
    document.body.className = state.darkMode ? 'dark-mode' : 'light-mode';
}

// Rendering Functions
function renderStepIndicator() {
    const container = document.getElementById('stepIndicator');
    if (state.currentStep === 4) {
        container.innerHTML = '';
        return;
    }

    let html = '';
    const steps = [
        { num: 1, label: 'Personal Info' },
        { num: 2, label: 'Documents' },
        { num: 3, label: 'Verification' }
    ];

    steps.forEach((step, index) => {
        const isActive = state.currentStep >= step.num;
        const isCompleted = state.currentStep > step.num;

        html += `
            <div class="step-item">
                <div class="step-circle ${isActive ? 'active' : 'inactive'}">
                    ${isCompleted ? `
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                    ` : step.num}
                </div>
                <span class="step-label">${step.label}</span>
            </div>
        `;

        if (index < steps.length - 1) {
            html += `<div class="step-connector ${state.currentStep > step.num ? 'active' : 'inactive'}"></div>`;
        }
    });

    container.innerHTML = html;
}

function createInputField(label, name, type = 'text', required = true, placeholder = '', error = null) {
    const value = name.includes('.')
        ? state.formData[name.split('.')[0]][name.split('.')[1]]
        : state.formData[name];

    // Special attributes for different field types
    let specialAttrs = '';

    // DOB BS - text input with pattern and maxlength
    if (name === 'dateOfBirthBS') {
        specialAttrs = 'maxlength="10" pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}" data-dobbs="true"';
    }

    // Ward number - numeric input with constraints
    if (name.includes('ward')) {
        specialAttrs = 'inputmode="numeric" pattern="[1-9][0-9]?" min="1" max="99" data-ward="true"';
    }

    // Date of birth AD - add min and max constraints
    if (name === 'dateOfBirth' && type === 'date') {
        const today = new Date().toISOString().split('T')[0];
        const minDate = new Date();
        minDate.setFullYear(minDate.getFullYear() - 120);
        const minDateStr = minDate.toISOString().split('T')[0];
        specialAttrs = `max="${today}" min="${minDateStr}"`;
    }

    return `
        <div class="form-group">
            <label class="form-label">
                ${label} ${required ? '<span class="required">*</span>' : ''}
            </label>
            <input 
                type="${type}" 
                name="${name}" 
                value="${value || ''}"
                placeholder="${placeholder}"
                class="form-input ${error ? 'error' : ''}"
                ${specialAttrs}
                ${type === 'date' && state.darkMode ? 'style="color-scheme: dark;"' : ''}
            />
            ${error ? `<p class="error-message">${error}</p>` : ''}
        </div>
    `;
}

function createSelectField(label, name, options, required = true, placeholder = 'Select...', error = null) {
    const value = name.includes('.')
        ? state.formData[name.split('.')[0]][name.split('.')[1]]
        : state.formData[name];

    const optionsHtml = options.map(opt => {
        const optValue = opt.value || opt;
        const optLabel = opt.label || opt;
        return `<option value="${optValue}" ${value === optValue ? 'selected' : ''}>${optLabel}</option>`;
    }).join('');

    return `
        <div class="form-group">
            <label class="form-label">
                ${label} ${required ? '<span class="required">*</span>' : ''}
            </label>
            <select name="${name}" class="form-select ${error ? 'error' : ''}">
                <option value="">${placeholder}</option>
                ${optionsHtml}
            </select>
            ${error ? `<p class="error-message">${error}</p>` : ''}
        </div>
    `;
}

function createFileUploadField(label, name, accept, preview, error, hint) {
    return `
        <div class="form-group">
            <label class="form-label">
                ${label} <span class="required">*</span>
            </label>
            <div class="file-upload-container ${error ? 'error' : ''}">
                ${preview ? `
                    <div class="preview-container">
                        <img src="${preview}" alt="Preview" class="preview-image" />
                        <button type="button" class="remove-preview-btn" data-field="${name}">✕</button>
                    </div>
                ` : `
                    <svg class="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="17 8 12 3 7 8"></polyline>
                        <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                    <p class="upload-text">Click to upload or drag and drop</p>
                    ${hint ? `<p class="upload-hint">${hint}</p>` : ''}
                `}
                <input type="file" accept="${accept}" class="file-input" id="${name}" data-field="${name}" />
                <label for="${name}" class="file-upload-btn">
                    ${preview ? 'Change File' : 'Choose File'}
                </label>
            </div>
            ${error ? `<p class="error-message">${error}</p>` : ''}
        </div>
    `;
}

function renderStep1() {
    return `
        <div class="form-section">
            <h2 class="section-title">Personal Information</h2>

            ${createInputField(
        'Full Name (as per document)',
        'fullName',
        'text',
        true,
        'E.g., Ram Bahadur Thapa',
        state.errors.fullName
    )}

            <div class="grid-2">
                ${createInputField(
        'Date of Birth (AD / ईस्वी)',
        'dateOfBirth',
        'date',
        true,
        '',
        state.errors.dateOfBirth
    )}

                ${createInputField(
        'Date of Birth (BS / बि.सं.)',
        'dateOfBirthBS',
        'text',
        true,
        'E.g., 2055-05-15',
        state.errors.dateOfBirthBS
    )}
            </div>

            <div class="info-box">
                <strong>Note:</strong> Enter BS date in YYYY-MM-DD format (e.g., 2055-05-15 for Shrawan 15, 2055)
            </div>

            ${createSelectField(
        'Gender',
        'gender',
        [
            { value: 'male', label: 'Male' },
            { value: 'female', label: 'Female' },
            { value: 'other', label: 'Other' }
        ],
        true,
        'Select...',
        state.errors.gender
    )}

            <h3 class="subsection-title">Current Address</h3>

            <div class="grid-2">
                ${createSelectField(
        'Province',
        'currentAddress.province',
        provinces,
        true,
        'Select...',
        state.errors['currentAddress.province']
    )}

                ${createInputField(
        'District',
        'currentAddress.district',
        'text',
        true,
        'E.g., Kathmandu',
        state.errors['currentAddress.district']
    )}
            </div>

            <div class="grid-2">
                ${createInputField(
        'Municipality',
        'currentAddress.municipality',
        'text',
        true,
        'E.g., Kathmandu Metropolitan',
        state.errors['currentAddress.municipality']
    )}

                ${createInputField(
        'Ward No.',
        'currentAddress.ward',
        'number',
        true,
        'E.g., 10',
        state.errors['currentAddress.ward']
    )}
            </div>

            ${createInputField(
        'Tole/Street',
        'currentAddress.tole',
        'text',
        false,
        'E.g., Putalisadak'
    )}
        </div>
    `;
}

function renderStep2() {
    const docLabel = state.formData.documentType === 'citizenship' ? 'Nagarikta Number' :
        state.formData.documentType === 'passport' ? 'Passport Number' :
            state.formData.documentType === 'license' ? 'License Number' : 'Document Number';

    return `
        <div class="form-section">
            <h2 class="section-title">Identity Document</h2>

            <div class="alert-box blue">
                <div class="alert-content">
                    <svg class="alert-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    <div class="alert-text">
                        <p style="font-weight: 600;">Important Guidelines:</p>
                        <ul>
                            <li>Upload clear, readable images</li>
                            <li>All four corners should be visible</li>
                            <li>File size should be less than 5MB</li>
                            <li>Accepted formats: JPG, JPEG, PNG</li>
                        </ul>
                    </div>
                </div>
            </div>

            ${createSelectField(
        'Document Type',
        'documentType',
        documentTypes,
        true,
        'Select document type',
        state.errors.documentType
    )}

            ${createInputField(
        docLabel,
        'documentNumber',
        'text',
        true,
        'E.g., 12345-6789-0123',
        state.errors.documentNumber
    )}

            ${createFileUploadField(
        'Document Front Side',
        'documentFront',
        'image/*',
        state.previewUrls.documentFront,
        state.errors.documentFront,
        'Upload front side of your document'
    )}

            ${state.formData.documentType !== 'passport' ? createFileUploadField(
        'Document Back Side',
        'documentBack',
        'image/*',
        state.previewUrls.documentBack,
        state.errors.documentBack,
        'Upload back side of your document'
    ) : ''}
        </div>
    `;
}

function renderStep3() {
    return `
        <div class="form-section">
            <h2 class="section-title">Verification</h2>

            <div class="alert-box yellow">
                <div class="alert-content">
                    <svg class="alert-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                        <circle cx="12" cy="13" r="4"></circle>
                    </svg>
                    <div class="alert-text">
                        <p style="font-weight: 600;">Selfie Instructions:</p>
                        <ul>
                            <li>Hold your document next to your face</li>
                            <li>Ensure your face is clearly visible</li>
                            <li>Document details should be readable</li>
                            <li>Good lighting is essential</li>
                        </ul>
                    </div>
                </div>
            </div>

            ${createFileUploadField(
        'Selfie with Document',
        'selfieImage',
        'image/*',
        state.previewUrls.selfieImage,
        state.errors.selfieImage,
        'Take a selfie holding your document next to your face'
    )}

            <h3 class="subsection-title">Permanent Address</h3>

            <div class="checkbox-container">
                <input 
                    type="checkbox" 
                    name="sameAsCurrentAddress" 
                    class="checkbox-input"
                    ${state.formData.sameAsCurrentAddress ? 'checked' : ''}
                />
                <label class="checkbox-label">Same as current address</label>
            </div>

            ${!state.formData.sameAsCurrentAddress ? `
                <div class="grid-2">
                    ${createSelectField(
        'Province',
        'permanentAddress.province',
        provinces,
        true,
        'Select...',
        state.errors['permanentAddress.province']
    )}

                    ${createInputField(
        'District',
        'permanentAddress.district',
        'text',
        true,
        'E.g., Pokhara'
    )}
                </div>

                <div class="grid-2">
                    ${createInputField(
        'Municipality',
        'permanentAddress.municipality',
        'text',
        true,
        'E.g., Pokhara Metropolitan'
    )}

                    ${createInputField(
        'Ward No.',
        'permanentAddress.ward',
        'number',
        true,
        'E.g., 5'
    )}
                </div>

                ${createInputField(
        'Tole/Street',
        'permanentAddress.tole',
        'text',
        false,
        'E.g., Lakeside'
    )}
            ` : ''}
        </div>
    `;
}

function renderStep4() {
    return `
        <div class="success-screen">
            <div class="success-icon-circle">
                <svg class="success-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
            </div>
            <h2 class="success-title">Verification Submitted!</h2>
            <p class="success-message">
                Your KYC documents have been submitted successfully.
                We will review and verify within 24-48 hours.
            </p>
            <div class="success-info-box">
                <p class="success-info-text">
                    <strong>Next Steps:</strong><br/>
                    1. We will verify your documents<br/>
                    2. You will receive a notification once approved<br/>
                    3. Start renting and earning with साझा Share!
                </p>
            </div>
            <button onclick="window.location.reload()" class="btn btn-next">
                Return to Home
            </button>
        </div>
    `;
}

function renderNavigationButtons() {
    const container = document.getElementById('navigationButtons');

    if (state.currentStep === 4) {
        container.innerHTML = '';
        return;
    }

    let html = '';

    if (state.currentStep > 1) {
        html += `
            <button class="btn btn-back" id="backBtn">Back</button>
        `;
    }

    html += `
        <button class="btn ${state.currentStep === 3 ? 'btn-submit' : 'btn-next'}" id="nextBtn">
            ${state.currentStep === 3 ? 'Submit' : 'Next'}
            ${state.currentStep < 3 ? `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
            ` : ''}
        </button>
    `;

    container.innerHTML = html;

    // Add event listeners
    const backBtn = document.getElementById('backBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (backBtn) {
        backBtn.addEventListener('click', handleBack);
    }

    if (nextBtn) {
        if (state.currentStep === 3) {
            nextBtn.addEventListener('click', handleSubmit);
        } else {
            nextBtn.addEventListener('click', handleNext);
        }
    }
}

function render() {
    // Render step indicator
    renderStepIndicator();

    // Render current step
    const formContainer = document.getElementById('formContainer');

    switch (state.currentStep) {
        case 1:
            formContainer.innerHTML = renderStep1();
            break;
        case 2:
            formContainer.innerHTML = renderStep2();
            break;
        case 3:
            formContainer.innerHTML = renderStep3();
            break;
        case 4:
            formContainer.innerHTML = renderStep4();
            break;
    }

    // Render navigation buttons
    renderNavigationButtons();

    // Add event listeners to form inputs
    attachEventListeners();
}

function attachEventListeners() {
    // Input fields
    const inputs = document.querySelectorAll('.form-input, .form-select');
    inputs.forEach(input => {
        // Special handling for DOB BS field - prevent Enter key submission and auto-format
        if (input.dataset.dobbs) {
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    return false;
                }
            });

            // Auto-format BS date as user types (replaces normal input handler)
            input.addEventListener('input', (e) => {
                let value = e.target.value.replace(/[^0-9]/g, '');
                if (value.length >= 4) {
                    value = value.slice(0, 4) + '-' + value.slice(4);
                }
                if (value.length >= 7) {
                    value = value.slice(0, 7) + '-' + value.slice(7);
                }
                if (value.length > 10) {
                    value = value.slice(0, 10);
                }
                if (e.target.value !== value) {
                    const cursorPos = e.target.selectionStart;
                    e.target.value = value;
                    // Restore cursor position
                    e.target.setSelectionRange(cursorPos, cursorPos);
                }
                // Update state without re-rendering
                state.formData.dateOfBirthBS = value;
                // Clear error if exists
                if (state.errors.dateOfBirthBS) {
                    delete state.errors.dateOfBirthBS;
                }
            });

            input.addEventListener('change', handleInputChange);
        }
        // Special handling for ward number - only allow positive integers
        else if (input.dataset.ward) {
            input.addEventListener('input', (e) => {
                let value = e.target.value.replace(/[^0-9]/g, '');
                // Remove leading zeros
                value = value.replace(/^0+/, '');
                // Limit to 2 digits
                if (value.length > 2) {
                    value = value.slice(0, 2);
                }
                // Ensure it's within 1-99 range
                const numValue = parseInt(value, 10);
                if (numValue > 99) {
                    value = '99';
                }
                if (e.target.value !== value) {
                    const cursorPos = e.target.selectionStart;
                    e.target.value = value;
                    // Restore cursor position
                    e.target.setSelectionRange(cursorPos, cursorPos);
                }
                // Update state without re-rendering
                const name = e.target.name;
                if (name.includes('.')) {
                    const [parent, child] = name.split('.');
                    state.formData[parent][child] = value;
                }
                // Clear error if exists
                if (state.errors[name]) {
                    delete state.errors[name];
                }
            });

            // Prevent negative sign, decimal, and 'e' from being entered
            input.addEventListener('keydown', (e) => {
                if (e.key === '-' || e.key === '.' || e.key === 'e' || e.key === 'E' || e.key === '+') {
                    e.preventDefault();
                    return false;
                }
            });

            input.addEventListener('change', handleInputChange);
        }
        // Normal inputs - use standard handlers
        else {
            input.addEventListener('change', handleInputChange);
            input.addEventListener('input', handleInputChange);
        }
    });

    // Checkboxes
    const checkboxes = document.querySelectorAll('.checkbox-input');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', handleInputChange);
    });

    // File inputs
    const fileInputs = document.querySelectorAll('.file-input');
    fileInputs.forEach(input => {
        input.addEventListener('change', (e) => {
            const fieldName = e.target.dataset.field;
            handleFileUpload(e, fieldName);
        });
    });

    // Remove preview buttons
    const removeButtons = document.querySelectorAll('.remove-preview-btn');
    removeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const fieldName = button.dataset.field;
            handleRemoveFile(fieldName);
        });
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Dark mode toggle
    const darkModeToggle = document.getElementById('darkModeToggle');
    darkModeToggle.addEventListener('click', toggleDarkMode);

    // Initial render
    render();
});
