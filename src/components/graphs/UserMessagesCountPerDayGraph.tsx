import React, { useContext } from 'react';
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import randomColor from 'randomcolor';
import { TelegramAnalyzerContext } from '../../App';

const UserMessagesCountPerDayGraph = () => {
  const { userMessagesPerDayData } = useContext(TelegramAnalyzerContext);
  return (
    <ResponsiveContainer width="100%" height={600}>
      <BarChart
        width={500}
        height={300}
        data={userMessagesPerDayData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        {userMessagesPerDayData && userMessagesPerDayData.length > 0 && Object.keys(userMessagesPerDayData[0]).filter(key => key !== "name").map((user, i) => {
          return <Bar dataKey={user} stackId={"a"} key={i} fill={randomColor({luminosity: 'bright', hue: 'random', alpha: 1})}/>
        })}
      </BarChart>
    </ResponsiveContainer>
  );
}

export default UserMessagesCountPerDayGraph;