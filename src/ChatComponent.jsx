import React, { useEffect, useState, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import 'bootstrap/dist/css/bootstrap.min.css';

const ChatComponent = () => {
  const [messages, setMessages] = useState([]);
  const [inputName, setInputName] = useState('');
  const [inputMessage, setInputMessage] = useState('');
  const [showNameInput, setShowNameInput] = useState(true); // Estado para controlar la visibilidad del input de nombre
  const stompClientRef = useRef(null);

  useEffect(() => {
    // Función para conectar y configurar el WebSocket
    const connectWebSocket = () => {
      const stompClient = new Client({
        //webSocketFactory: () => new WebSocket('wss://java-taxi-seguimiento.onrender.com/websocket')
        webSocketFactory: () => new WebSocket('ws://localhost:8080/websocket')
      });

      stompClient.onConnect = () => {
        stompClient.subscribe('/tema/mensajes', (message) => {
          showMessage(message.body);
        });
      };

      stompClient.onWebSocketClose = () => {
        stompClientRef.current = null; // Limpiar la referencia cuando se cierra
      };

      stompClient.activate();
      stompClientRef.current = stompClient; // Asignar a la referencia
    };

    connectWebSocket();

    // Función de limpieza al desmontar el componente
    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
        stompClientRef.current = null; // Limpiar la referencia al desmontar
      }
    };
  }, []);

  const showMessage = (message) => {
    const body = JSON.parse(message);
    setMessages((prevMessages) => [...prevMessages, body]);
  };

  const sendMessage = () => {
    if (stompClientRef.current) {
      stompClientRef.current.publish({
        destination: '/app/envio',
        body: JSON.stringify({
          nombre: inputName,
          contenido: inputMessage
        })
      });
      setInputMessage('');
    } else {
      console.error('Error: No se pudo enviar el mensaje. WebSocket no está activo.');
    }
  };

  const handleNameInputBlur = () => {
    if (inputName.trim() !== '') {
      setShowNameInput(false); // Ocultar el input de nombre si se ha ingresado uno válido
    }
  };

  return (
    <div className="container">
      <div id="containerMensajes">
        <div id="mensajes" className="container">
          <ul id="ULMensajes" className="list-group">
            {messages.map((msg, index) => (
              <li key={index} className="list-group-item">
                <strong>{msg.nombre}</strong>: {msg.contenido}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div id="containerInputs" className="container">
        {showNameInput && (
          <input
            id="nombre"
            type="text"
            className="form-control"
            placeholder="Nombre"
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
            onBlur={handleNameInputBlur} // Manejar el evento blur para ocultar el input de nombre si se ha ingresado
          />
        )}
        <input
          id="mensaje"
          type="text"
          className="form-control"
          placeholder="Mensaje"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
        />
        <button id="btnEnviar" className="btn btn-success" onClick={sendMessage}>
          <span className="material-symbols-outlined">Enviar</span>
        </button>
      </div>
    </div>
  );
};

export default ChatComponent;
