document.addEventListener('DOMContentLoaded', async () => {
    const [tab] = await chrome.tabs.query({active: true, currentWindow: true});

    const title = tab.title;
    const url = tab.url;

    document.getElementById('page-title').textContent = title;
    document.getElementById('page-url').textContent = url;

    document.getElementById('save-btn').addEventListener('click', async () => {
        const statusDiv = document.getElementById('status');
        statusDiv.textContent = "저장 중...";

        try {
            const response = await fetch('http://localhost:8000/api/v1/links/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',

                body: JSON.stringify({
                    title: title,
                    url: url
                })
            });

            if (response.ok) {
                statusDiv.textContent = "저장 완료! ✅";
                statusDiv.style.color = "green";
                setTimeout(() => window.close(), 2000);
            } else if (response.status === 401) {
                statusDiv.textContent = "로그인이 필요합니다. 사이트에서 로그인해주세요.";
                statusDiv.style.color = "red";
            } else {
                throw new Error('Server Error: ' + response.status);
            }

        } catch (error) {
            console.error(error);
            statusDiv.textContent = "에러: " + error.message;
            statusDiv.style.color = "red";
        }
    });
});
