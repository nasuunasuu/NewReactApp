import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';

function Palette({ showPalette }) {
  const [selectedColor, setSelectedColor] = useState('');
  const [palette, setPalette] = useState([]);
  const [showAddColorForm, setShowAddColorForm] = useState(false);
  const [newColor, setNewColor] = useState('#ffffff');
  const [newColorText, setNewColorText] = useState('');

  const addColorToPalette = async () => {
    setPalette([...palette, { color: newColor, text: newColorText }]);

    // Firestore にデータを追加
    try {
      const db = getFirestore(); // Firestore データベースを取得
      const colorsCollection = collection(db, 'colors'); // 'colors' コレクションを参照
      await addDoc(colorsCollection, { color: newColor, text: newColorText }); // Firestore に新しいドキュメントを追加
    } catch (error) {
      console.error('Error adding document: ', error);
    }
    setNewColorText('');
  };

  const handleSelectColor = (color) => {
    setSelectedColor(color === selectedColor ? '' : color);
  };

  const removeColorFromPalette = async (id) => {
    try {
      const db = getFirestore();
      const colorsCollection = collection(db, 'colors');
      await deleteDoc(doc(colorsCollection, id));
      const newPalette = palette.filter(item => item.id !== id);
      setPalette(newPalette);
    } catch (error) {
      console.error('Error removing document: ', error);
    }
  };

  useEffect(() => {
    // Firestore からデータを取得するロジックを useEffect 内に移動
    const fetchData = async () => {
      try {
        const db = getFirestore();
        const querySnapshot = await getDocs(collection(db, 'colors'));
        const fetchedColors = [];
        querySnapshot.forEach(doc => {
          const data = doc.data();
          fetchedColors.push({ id: doc.id, ...data });
        });
        setPalette(fetchedColors);
      } catch (error) {
        console.error('Error fetching documents: ', error);
      }
    };

    fetchData(); 

  }, []);

  return (
    <div style={{ position: 'fixed', bottom: '10px', right: '10px', display: 'flex' }}>
      {showPalette && (
        <div style={{
          position: 'fixed',
          bottom: '50px',
          right: '10px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          padding: '5px',
          borderRadius: '5px',
          backgroundColor: '#f0f0f0',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
        }}>
          <button onClick={() => setShowAddColorForm(!showAddColorForm)} style={{ marginBottom: '10px' }}>
            {showAddColorForm ? '×' : 'ADD Color'}
          </button>
          {showAddColorForm && (
            <div style={{ marginBottom: '10px' }}>
              <input type="color" value={newColor} onChange={(e) => setNewColor(e.target.value)} />
              <input type="text" value={newColorText} onChange={(e) => setNewColorText(e.target.value)} placeholder="Color text" />
              <button onClick={addColorToPalette}>Save</button>
            </div>
          )}
          <div style={{ display: 'flex' }}>
            {palette.map((item, index) => (
              <div key={index} style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '0 5px' }}>
                <button
                  style={{
                    backgroundColor: item.color,
                    width: '80px',
                    height: '55px',
                    textAlign: 'center',
                  }}
                  onClick={() => handleSelectColor(item.color)}
                >
                </button>
                <button
                  style={{
                    position: 'absolute',
                    top: '-10px',
                    right: '73px',
                    width: '20px',
                    height: '20px',
                    lineHeight: '20px',
                    textAlign: 'center',
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: 'red',
                    cursor: 'pointer',
                    fontSize: '30px'
                  }}
                  onClick={() => removeColorFromPalette(item.id)}
                >
                  ×
                </button>
                <div style={{ color: 'black', textAlign: 'center', marginTop: '5px' }}>
                  {item.text}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Palette;
