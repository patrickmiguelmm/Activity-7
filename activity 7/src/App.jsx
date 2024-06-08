import React, { useEffect, useState } from 'react';
import axios from 'axios';

const useFetchData = (url) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(url);
        setData(response.data);
      } catch (err) {
        setError(err);
        console.error('There was an error fetching data!', err);
      }
    };
    fetchData();
  }, [url]);

  return { data, setData, error };
};

const App = () => {
  const { data, setData, error } = useFetchData('https://superlative-squirrel-f76f41.netlify.app/.netlify/functions/api');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [editItem, setEditItem] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name || !age) {
      alert('Recipe and ingredients are required');
      return;
    }
    
    const url = editItem
      ? `https://superlative-squirrel-f76f41.netlify.app/.netlify/functions/api/${editItem._id}`
      : 'https://superlative-squirrel-f76f41.netlify.app/.netlify/functions/api';
    
    const method = editItem ? 'put' : 'post';

    try {
      const response = await axios[method](url, { name, age });
      
      if (editItem) {
        setData(data.map((item) => (item._id === editItem._id ? response.data : item)));
      } else {
        setData([...data, response.data]);
      }

      setName('');
      setAge('');
      setEditItem(null);
    } catch (err) {
      console.error('There was an error!', err);
    }
  };

  const handleEdit = (id) => {
    const itemToEdit = data.find((item) => item._id === id);
    setEditItem(itemToEdit);
    setName(itemToEdit.name);
    setAge(itemToEdit.age);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://superlative-squirrel-f76f41.netlify.app/.netlify/functions/api/${id}`);
      setData(data.filter((item) => item._id !== id));
    } catch (err) {
      console.error('There was an error!', err);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Recipe Book</h2>
      <div className="card p-4 mb-4">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="recipeName">Recipe Name</label>
            <input
              type="text"
              id="recipeName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Recipe"
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label htmlFor="recipeIngredients">Ingredients</label>
            <textarea
              id="recipeIngredients"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Ingredients"
              rows={4}
              className="form-control"
            />
          </div>
          <button type="submit" className="btn btn-primary">
            {editItem ? 'Update Recipe' : 'Add Recipe'}
          </button>
        </form>
      </div>

      {error && <div className="alert alert-danger">{error.message}</div>}

      <table className="table table-hover">
        <thead className="thead-light">
          <tr>
            <th>Recipe</th>
            <th>Ingredients</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item._id}>
              <td>{item.name}</td>
              <td>{item.age}</td>
              <td>
                <button onClick={() => handleEdit(item._id)} className="btn btn-success btn-sm mr-2">
                  Edit
                </button>
                <button onClick={() => handleDelete(item._id)} className="btn btn-danger btn-sm">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
