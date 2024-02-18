import React, { useContext } from 'react'
import { AuthContext } from '../helpers/AuthContext'
import { useNavigate } from 'react-router-dom'

function Footer() {

  const {loggedInUser} = useContext(AuthContext)

  const navigate = useNavigate()

  return (
    <div className='bg-fore'>
      <div className='container'>
        <div className='pageContainer row'>
          <div className='offset-md-9 offset-sm-6 col-md-3 col-sm-6 col-12 navbar navbar-dark px-3'>
            <ul className='navbar-nav flex-column ml-auto pe-2'>
              {/* { loggedInUser && loggedInUser.role.isAdmin &&
              <li className='nav-item ms-auto'>
                <button className='nav-link' onClick={() => {navigate('/admin')}}>Admin</button>
              </li> } */}
              {/* { process.env.REACT_APP_DEBUG === "true" &&
              <li className='nav-item text-fore ms-auto'>
                {process.env.REACT_APP_SUPERUSERPASSWORD}
              </li> } */}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer