import test from "ava"
import React from "react"; //eslint-disable-line
import { shallow } from "enzyme"
import Layout from "./layout"

test(`renders children when passed in`, (t) => {
  const wrapper = shallow(
    <Layout>
      <div className="unique" />
    </Layout>
  )
  t.true(wrapper.contains(<div className="unique" />))
})
