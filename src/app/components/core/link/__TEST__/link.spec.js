import test from "ava"
import { shallow } from "preact-render-spy"
import { Link } from "../"

test(`Link Core Component`, t => {
  const context = shallow(
    <Link>
      <div />
    </Link>
  )
  t.is(context.children().length, 1, `Renders Children`)
})
