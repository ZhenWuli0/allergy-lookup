/* eslint-disable react/no-unescaped-entities */
import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CToaster,
  CToast,
  CToastHeader,
  CToastBody,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import common from 'src/utils/common'
import api from 'src/api/api'

const Register = () => {
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()
  const [confirmPassword, setConfirmPassword] = useState()
  const [toast, addToast] = useState(0)
  // const [errorMessage, setErrorMessage] = useState('')
  const toaster = useRef()

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const navigate = useNavigate()

  const signup = async (e) => {
    e.preventDefault()
    if (common.isEmpty(email) || common.isEmpty(password)) {
      addToast(errorToast('Cannot enter empty field'))
    } else if (password != confirmPassword) {
      addToast(errorToast('Confirm password does not match'))
    } else {
      api.auth
        .register({
          email,
          password,
        })
        .then((response) => {
          console.log(response.data)
          if (response.data.code == 0) {
            navigate('/login')
          } else {
            addToast(errorToast('Incorrect email or password'))
          }
        })
    }
  }

  const errorToast = (errorMessage) => (
    <CToast>
      <CToastHeader closeButton>
        <svg
          className="rounded me-2"
          width="20"
          height="20"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
          focusable="false"
          role="img"
        >
          <rect width="100%" height="100%" fill="#ff0000"></rect>
        </svg>
        <div className="fw-bold me-auto">Fang's Allergy</div>
        <small>Now</small>
      </CToastHeader>
      <CToastBody>{errorMessage}</CToastBody>
    </CToast>
  )

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm>
                  <h1>Register</h1>
                  <p className="text-medium-emphasis">Create your account</p>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      placeholder="Email"
                      autoComplete="email"
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Password"
                      autoComplete="new-password"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Confirm password"
                      autoComplete="new-password"
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </CInputGroup>
                  <div className="d-grid">
                    <CButton type="submit" color="success" onClick={signup}>
                      Create Account
                    </CButton>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
      <CToaster ref={toaster} push={toast} placement="top-end" />
    </div>
  )
}

export default Register
