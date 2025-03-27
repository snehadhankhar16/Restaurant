import React from 'react'
import Header from '../Components/Header'

const Login = () => {
  return (
   <div>
    <Header/>
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
    <div className="card p-4 shadow-lg" style={{ width: "400px", borderRadius: "10px" }}>
      <h3 className="text-center mb-4">Login</h3>
      <form>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email address</label>
          <input type="email" className="form-control" id="email" placeholder="Enter email" required />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input type="password" className="form-control" id="password" placeholder="Enter password" required />
        </div>
        <button type="submit" className="btn btn-primary w-100">Login</button>
      </form>
      <p className="text-center mt-3">
        <a href="#" className="text-decoration-none">Forgot password?</a>
      </p>
    </div>
  </div>
   </div>
  )
}

export default Login
