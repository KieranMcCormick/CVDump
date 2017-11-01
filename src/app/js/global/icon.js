// Icon Utils
// ---
import React from 'react'
import PropTypes from 'prop-types'


// TODO: change it to svg
export const Logo = ({ style }) => (
    <img
        src="/assets/logo.png"
        alt="Logo"
        style={style}
    />
)

Logo.propTypes = {
    style: PropTypes.object.isRequired,
}
