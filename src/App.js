// App.js
import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [message, setMessage] = useState('');

  const test = async () => {
    try {
      const response = await fetch('http://be614213bec778ecb27210265bd54e82f.apppaas.app:30081/api/test', {
        method: 'GET', // 또는 POST라면 'POST'로 바꾸고 body 설정
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json(); // 백엔드가 JSON으로 메시지를 반환한다고 가정
      setMessage(data.message); // 예: { message: "Hello from backend!" }
    } catch (error) {
      console.error('Error fetching message:', error);
      setMessage('메시지를 가져오는데 실패했습니다');
    }
  };

  return (
    <div className="App">
      <div>
        <input type="button" value="백엔드 확인" onClick={test} />
      </div>
      <div>
        응답 메시지: {message}
      </div>
    </div>
  );
}

export default App;
