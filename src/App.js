import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [text, setText] = useState('');
  const [recording, setRecording] = useState(false);

  const handleRecognize = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/recognize');
      if (response.status === 200) {
        setText(response.data.text || response.data.error);
      } else {
        console.error('Error recognizing speech:', response.status);
      }
    } catch (error) {
      console.error('Error recognizing speech:', error);
    }
  };

  const handleSpeak = async () => {
    try {
      await axios.post('http://127.0.0.1:5000/speak', { text });
      alert('Spoken successfully!');
    } catch (error) {
      console.error('Error speaking text:', error);
    }
  };

  const startRecording = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support speech recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setRecording(true);
    };

    recognition.onresult = (event) => {
      const lastResult = event.results[event.resultIndex];
      if (lastResult.isFinal) {
        setText(lastResult[0].transcript);
        setRecording(false);
        recognition.stop();
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      setRecording(false);
    };

    recognition.onend = () => {
      setRecording(false);
    };

    recognition.start();
  };

  return (
    <div className="App">
      <h1>Speech Recognition and Text-to-Speech</h1>
      <button onClick={startRecording} disabled={recording}>
        {recording ? 'Recording...' : 'Start Recording'}
      </button>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows="4"
        cols="50"
      />
      <button onClick={handleRecognize}>Recognize Speech</button>
      <button onClick={handleSpeak}>Speak Text</button>
    </div>
  );
}

export default App;
