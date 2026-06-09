// ============================================
        // COGNITO CONFIG
        // ============================================
        const COGNITO_CONFIG = {
            UserPoolId: 'us-east-1_ozyjqrW4A',
            ClientId: '4l2c22pf92vij4v6303te0p4u1'
        };

        const userPool = new AmazonCognitoIdentity.CognitoUserPool(COGNITO_CONFIG);
        let currentUser = null;

        // ============================================
        // AUTH STATE MANAGEMENT
        // ============================================
        function checkAuthState() {
            console.log('=== CHECKING AUTH STATE ===');
            const cognitoUser = userPool.getCurrentUser();

            if (!cognitoUser) {
                console.log('No current user — showing auth gate.');
                showLoggedOutState();
                return;
            }

            cognitoUser.getSession((err, session) => {
                if (err || !session || !session.isValid()) {
                    console.log('Session invalid or expired — showing auth gate.', err);
                    showLoggedOutState();
                    return;
                }
                console.log('Valid session found.');
                cognitoUser.getUserAttributes((attrErr, attrs) => {
                    let email = cognitoUser.getUsername();
                    if (!attrErr && attrs) {
                        const emailAttr = attrs.find(a => a.Name === 'email');
                        if (emailAttr) email = emailAttr.Value;
                    }
                    currentUser = { cognitoUser, email };
                    showLoggedInState(email);
                });
            });
        }

        function showLoggedInState(email) {
            document.getElementById('authGate').style.display = 'none';
            document.getElementById('adminContent').style.display = 'block';
            document.getElementById('loginBtn').style.display = 'none';
            document.getElementById('logoutBtn').style.display = 'inline-block';
            const badge = document.getElementById('userBadge');
            badge.textContent = email;
            badge.style.display = 'inline-block';
            closeLoginModal();
        }

        function showLoggedOutState() {
            document.getElementById('authGate').style.display = 'block';
            document.getElementById('adminContent').style.display = 'none';
            document.getElementById('loginBtn').style.display = 'inline-block';
            document.getElementById('logoutBtn').style.display = 'none';
            document.getElementById('userBadge').style.display = 'none';
            currentUser = null;
        }

        // ============================================
        // LOGIN MODAL
        // ============================================
        function openLoginModal(event) {
            if (event) event.preventDefault();
            document.getElementById('loginModal').style.display = 'block';
            document.getElementById('loginError').style.display = 'none';
            setTimeout(() => document.getElementById('email').focus(), 100);
        }

        function closeLoginModal() {
            document.getElementById('loginModal').style.display = 'none';
            document.getElementById('loginForm').reset();
            document.getElementById('loginError').style.display = 'none';
        }

        // Close modal when clicking outside content
        window.addEventListener('click', (e) => {
            const modal = document.getElementById('loginModal');
            if (e.target === modal) closeLoginModal();
        });

        function handleLogin(event) {
            event.preventDefault();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const errorDiv = document.getElementById('loginError');
            const submitBtn = document.getElementById('loginSubmitBtn');

            errorDiv.style.display = 'none';
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';

            const authDetails = new AmazonCognitoIdentity.AuthenticationDetails({
                Username: email,
                Password: password
            });

            const cognitoUser = new AmazonCognitoIdentity.CognitoUser({
                Username: email,
                Pool: userPool
            });

            cognitoUser.authenticateUser(authDetails, {
                onSuccess: () => {
                    console.log('=== LOGIN SUCCESS ===');
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Login';
                    checkAuthState();
                },
                onFailure: (err) => {
                    console.error('=== LOGIN FAILED ===', err);
                    let msg = err.message || 'Login failed';
                    if (err.code === 'NotAuthorizedException') msg = 'Incorrect email or password.';
                    else if (err.code === 'UserNotFoundException') msg = 'No account exists for this email.';
                    else if (err.code === 'UserNotConfirmedException') msg = 'Account not confirmed. Contact the administrator.';
                    errorDiv.textContent = msg;
                    errorDiv.style.display = 'block';
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Login';
                },
                newPasswordRequired: () => {
                    errorDiv.textContent = 'Password change required. Contact the administrator.';
                    errorDiv.style.display = 'block';
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Login';
                }
            });
        }

        function logout(event) {
            if (event) event.preventDefault();
            const cognitoUser = userPool.getCurrentUser();
            if (cognitoUser) {
                cognitoUser.signOut();
                console.log('=== USER SIGNED OUT ===');
            }
            showLoggedOutState();
        }

        // ============================================
        // UPLOAD LOGIC (unchanged from previous version)
        // ============================================
        const API_ENDPOINT = 'https://il4psjqi16.execute-api.us-east-1.amazonaws.com/prod/generate-upload-url';
        let selectedFile = null;

        const fileInput = document.getElementById('fileInput');
        const fileLabel = document.querySelector('.file-label');

        fileInput.addEventListener('change', function(e) {
            selectedFile = e.target.files[0];
            if (selectedFile) {
                console.log('File selected:', selectedFile.name);
                fileLabel.innerHTML = `<i class="fas fa-check-circle"></i> <span>${selectedFile.name}</span>`;
                fileLabel.style.backgroundColor = '#e8f5e9';
                fileLabel.style.color = '#2e7d32';
                document.getElementById('uploadBtn').disabled = false;
            }
        });

        fileLabel.addEventListener('dragover', (e) => {
            e.preventDefault();
            fileLabel.style.backgroundColor = '#e3f2fd';
        });

        fileLabel.addEventListener('dragleave', () => {
            fileLabel.style.backgroundColor = '';
        });

        fileLabel.addEventListener('drop', (e) => {
            e.preventDefault();
            selectedFile = e.dataTransfer.files[0];
            fileInput.files = e.dataTransfer.files;
            if (selectedFile) {
                console.log('File dropped:', selectedFile.name);
                fileLabel.innerHTML = `<i class="fas fa-check-circle"></i> <span>${selectedFile.name}</span>`;
                fileLabel.style.backgroundColor = '#e8f5e9';
                document.getElementById('uploadBtn').disabled = false;
            }
        });

        document.getElementById('uploadBtn').addEventListener('click', async function() {
            console.log('=== UPLOAD BUTTON CLICKED ===');

            if (!currentUser) {
                showStatus('You must be signed in to upload.', 'error');
                openLoginModal();
                return;
            }

            const datasetType = document.getElementById('datasetType').value;
            const site = document.getElementById('siteSelect').value;

            if (!selectedFile) { showStatus('Please select a file', 'error'); return; }
            if (!datasetType)  { showStatus('Please select a dataset type', 'error'); return; }
            if (!site)         { showStatus('Please select a monitoring site', 'error'); return; }

            const uploadBtn = document.getElementById('uploadBtn');
            const originalText = uploadBtn.innerHTML;
            uploadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';
            uploadBtn.disabled = true;

            showStatus('Starting upload process...', 'info');

            try {
                showStatus('Requesting presigned URL from server...', 'info');
                const presignedURLData = await requestPresignedURL(selectedFile.name, datasetType, site, selectedFile.type);
                if (!presignedURLData || !presignedURLData.uploadUrl) throw new Error('Failed to get presigned URL from server');

                showStatus('Got presigned URL! Uploading file to S3...', 'info');
                await uploadFileToS3(selectedFile, presignedURLData.uploadUrl);

                showStatus('File uploaded successfully!', 'success');

                const uploadResult = {
                    fileName: selectedFile.name,
                    datasetType: getDatasetTypeLabel(datasetType),
                    site: site,
                    uploadTime: new Date().toLocaleString(),
                    status: 'Uploaded',
                    s3Path: presignedURLData.s3Path || presignedURLData.fileKey || presignedURLData.key || selectedFile.name,
                    message: 'Upload successful'
                };
                addUploadResult(uploadResult);
                showStatus('✓ Dataset uploaded successfully! S3 Path: ' + uploadResult.s3Path, 'success');
                resetUploadForm();
            } catch (error) {
                console.error('=== UPLOAD ERROR ===', error);
                showStatus('✗ Error during upload: ' + error.message, 'error');
            } finally {
                uploadBtn.innerHTML = originalText;
                uploadBtn.disabled = false;
            }
        });

        async function requestPresignedURL(fileName, datasetType, site, fileType) {
            const requestBody = { fileName, fileType, datasetType, site };
            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
            }
            return await response.json();
        }

        async function uploadFileToS3(file, presignedUrl) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onprogress = (event) => {
                    if (event.lengthComputable) {
                        const percentComplete = (event.loaded / event.total) * 100;
                        updateProgress(percentComplete);
                    }
                };
                reader.onload = async function(e) {
                    try {
                        const response = await fetch(presignedUrl, {
                            method: 'PUT',
                            headers: { 'Content-Type': file.type || 'text/csv' },
                            body: e.target.result
                        });
                        if (!response.ok) throw new Error(`S3 upload failed with status: ${response.status}`);
                        updateProgress(100);
                        resolve();
                    } catch (error) { reject(error); }
                };
                reader.onerror = () => reject(new Error('File reading error'));
                reader.readAsArrayBuffer(file);
            });
        }

        function updateProgress(percent) {
            const c = document.getElementById('uploadProgress');
            c.style.display = 'block';
            const fill = document.getElementById('progressFill');
            const text = document.getElementById('progressText');
            const rounded = Math.round(percent);
            fill.style.width = rounded + '%';
            fill.textContent = rounded + '%';
            text.textContent = 'Uploading... ' + rounded + '%';
        }

        function showStatus(message, type) {
            const s = document.getElementById('statusMessage');
            s.textContent = message;
            s.className = 'status-message ' + type;
            s.style.display = 'block';
            if (type === 'info') setTimeout(() => { s.style.display = 'none'; }, 5000);
        }

        function getDatasetTypeLabel(value) {
            const labels = {
                'air-quality': 'Air Quality Measurements',
                'noise': 'Noise Monitoring Data',
                'weather': 'Weather Data',
                'traffic': 'Traffic Analysis Data'
            };
            return labels[value] || value;
        }

        function addUploadResult(result) {
            const tbody = document.getElementById('resultsTableBody');
            const row = tbody.insertRow(0);
            row.innerHTML = `
                <td>${result.fileName}</td>
                <td>${result.datasetType}</td>
                <td>${result.site}</td>
                <td>${result.uploadTime}</td>
                <td><span class="status-badge status-uploaded">${result.status}</span></td>
                <td><code style="font-size: 11px; word-break: break-all;">${result.s3Path}</code></td>
                <td>${result.message}</td>
            `;
            document.getElementById('uploadResults').style.display = 'block';
        }

        function resetUploadForm() {
            selectedFile = null;
            fileInput.value = '';
            fileLabel.innerHTML = '<i class="fas fa-cloud-upload-alt"></i><span>Click to select file or drag and drop</span>';
            fileLabel.style.backgroundColor = '';
            document.getElementById('uploadBtn').disabled = true;
            document.getElementById('datasetType').value = '';
            document.getElementById('siteSelect').value = '';
            document.getElementById('uploadProgress').style.display = 'none';
            document.getElementById('progressFill').style.width = '0%';
            document.getElementById('progressText').textContent = '0%';
        }

        // ============================================
        // BOOTSTRAP — runs once the page is loaded
        // ============================================
        console.log('=== ADMIN UPLOAD PAGE LOADED ===');
        console.log('API Endpoint:', API_ENDPOINT);
        console.log('Cognito Pool:', COGNITO_CONFIG.UserPoolId);
        checkAuthState();