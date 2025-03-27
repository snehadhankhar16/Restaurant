import React, { useState } from 'react'
import AdminHeader from '../Components/AdminHeader';

const Owners = () => {
    const [menuItems, setMenuItems] = useState([]);
    const[image,setimage]=useState(null)
    const [newItem, setNewItem] = useState({ name: "", price: "", description: "" });
  
    const handleChange = (e) => {
      setNewItem({ ...newItem, [e.target.name]: e.target.value });
    };
  
    const handleUpload = (e) => {
      e.preventDefault();
      if (newItem.name && newItem.price && newItem.description) {
        setMenuItems([...menuItems, newItem]);
        setNewItem({ name: "", price: "", description: "" });
      }
    };
  
    const handleDelete = (index) => {
      const updatedMenu = menuItems.filter((_, i) => i !== index);
      setMenuItems(updatedMenu);
    };
  
    return (
      <div>
        <AdminHeader/>
        <div className="container py-5">
        <h2 className="text-center mb-4">Upload Your Menu</h2>
        <div className="col-lg-12">
          <form className="p-4 border rounded mb-4 row">
            <div className="col-lg-8">
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input type="text" name="name" className="form-control" value={newItem.name} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Price</label>
                <input type="number" name="price" className="form-control" value={newItem.price} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Category</label>
                <select type="text" name="category" className="form-control">
                  <option value="None">Select Category</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea name="description" className="form-control" value={newItem.description} onChange={handleChange} required />
              </div>
              <button type="submit" onClick={handleUpload} className="btn btn-success w-100">Upload Menu Item</button>
            </div>
            <div className="col-lg-4 mt-4">
              <div style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
                <div style={{height:"230px",width:"85%"}} className="border rounded">
                {image?<img height={"100%"} width={"100%"} src={URL.createObjectURL(image)}></img>:<div style={{height:"100%",width:"100%",display:"flex",justifyContent:"center",alignItems:"center",background:" rgba(0, 0, 0, 0.1)",boxShadow:" 2px 2px 2px rgba(0, 0, 0, 0.3)"}}><span style={{fontWeight:200}}>Image is not uploaded yet!</span></div>}
                </div>
              </div>
              <div className="text-center">
                <button type='button' style={{width:"85%"}} className="btn btn-primary mt-2">{image?"Change Image":"Upload Image"}</button>
              </div>
            </div>
          </form>
        </div>
        <h3 className="text-center">Menu List</h3>
        <table className="table table-bordered mt-3">
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Description</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {menuItems.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td>${item.price}</td>
                <td>{item.description}</td>
                <td>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(index)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>
    );
}
export default Owners