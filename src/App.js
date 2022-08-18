import React, { useState, useEffect } from 'react';
import List from './List';
import Alert from './Alert';
const getLocalStorage =()=>{
  let localList = localStorage.getItem('list')
  if (localList) {
    return JSON.parse(localStorage.getItem('list'));
  } else {
    return [];
  }
}
function App() {
  const [name, setName] = useState('');
  const [list, setList] = useState(getLocalStorage());
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [alert, setAlert] = useState({ show: false, msg: '', type: '' });
  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log('submit');
    if (!name) {
      showAlert(true,'please enter the product name','danger')
    } else if (name && isEditing) {
      setList(list.map((item)=>{
        if(item.id === editId){
          return{
            ...item,title:name
          }
        }
        return item
      }))
      setIsEditing(false)
      setName('')
       showAlert(true, 'Item changed', 'success');
    } else {
      const newItem = { id: new Date().getTime().toString(), title: name };
      setList([...list, newItem]);
      setName('');
      showAlert(true, 'Item added', 'success');
    }
  };
  const showAlert =(show=false,msg='',type='')=>{
    setAlert({show,msg,type})
    
  }
  const deleteItem = (id) => {
    const newList = list.filter((item) => item.id != id);
    setList(newList);
     showAlert(true, 'Item removed', 'danger');
  };
  const editItem = (id) => {
    const specificItem = list.find((item)=>item.id ===id)
    setIsEditing(true)
    setEditId(id)
    setName(specificItem.title)
    // console.log(id)
    // console.log(title)
  };
  useEffect(()=>{
    localStorage.setItem("list",JSON.stringify(list))
  },[list])
  const clearList =()=>{
    setList([])
     showAlert(true, 'List is empty', 'danger');
  }
  return (
    <section className='section-center'>
      <form className='grocery-form' onSubmit={(e) => handleSubmit(e)}>
        {alert.show && <Alert {...alert} removeAlert={showAlert} list={list}/>}

        <h3>grocery bud</h3>
        <div className='form-control'>
          <input
            className='grocery'
            type='text'
            id='grocery'
            placeholder='e.g. eggs'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button type='submit' className='submit-btn'>
            {isEditing ? 'edit' : 'submit'}
          </button>
        </div>
      </form>
    {list.length >0 &&
    
      <div className='grocery-container'>
        <List items={list} deleteItem={deleteItem} editItem={editItem} />
        <button className='clear-btn' onClick={()=>clearList()}>clear items</button>
      </div>
    }
    </section>
  );
}

export default App;
