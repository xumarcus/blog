// Copyright (C) 2021 Marcus Xu
//
// This file is part of blog.
//
// blog is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// blog is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with blog.  If not, see <http://www.gnu.org/licenses/>.

import {
  Label,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps,
} from 'recharts'

interface Props {
  data: [string, number][]
  formatter?: TooltipProps<number, string>['formatter']
  name: string
  title?: string
}

// Explicitly typing `React.FunctionComponent<Props>` is a hack for `MDXComponents.tsx`
const SimpleLineChart: React.FunctionComponent<Props> = ({
  data,
  formatter,
  name,
  title,
}: Props) => (
  <>
    {title && (
      <ResponsiveContainer width="100%">
        <strong style={{ display: 'block', textAlign: 'center' }}>{title}</strong>
      </ResponsiveContainer>
    )}
    <ResponsiveContainer aspect={2.0} height="100%" width="100%">
      <LineChart data={data.map(([x, value]) => ({ x, value }))}>
        <Label value={title} offset={0} position="insideBottom" />
        <CartesianGrid strokeDasharray={5} />
        <XAxis dataKey="x" />
        <YAxis />
        <Tooltip formatter={formatter} />
        <Legend />
        <Line name={name} type="monotone" dataKey="value" />
      </LineChart>
    </ResponsiveContainer>
  </>
)

export default SimpleLineChart
