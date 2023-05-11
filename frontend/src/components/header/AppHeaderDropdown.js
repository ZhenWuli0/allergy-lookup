import React from 'react'
import {
  CAvatar,
  CDropdown,
  CDropdownDivider,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import { cilAccountLogout, cilUser } from '@coreui/icons'
import CIcon from '@coreui/icons-react'

import avatar8 from 'src/assets/images/avatars/8.jpg'
import api from 'src/api/api'

const AppHeaderDropdown = () => {
  const displayEmail = sessionStorage.getItem('email')

  const logout = async (e) => {
    e.preventDefault()
    api.auth.logout().then(() => {
      window.location.href = '/'
    })
  }

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0" caret={false}>
        <CAvatar src={avatar8} size="md" />
      </CDropdownToggle>
      <CDropdownMenu placement="bottom-end">
        <CDropdownItem href="#">
          <CIcon icon={cilUser} className="me-2" />
          {displayEmail}
        </CDropdownItem>
        <CDropdownDivider />
        <CDropdownItem href="#" onClick={logout}>
          <CIcon icon={cilAccountLogout} className="me-2" />
          Log out
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
