import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts'
import './SkillRadar.css'

const skillCategories = {
  languages: {
    name: 'Languages',
    color: '#7aa2f7',
    skills: [
      { name: 'Python', value: 90 },
      { name: 'Java', value: 85 },
      { name: 'JavaScript', value: 80 },
      { name: 'SQL', value: 75 },
      { name: 'C/C++', value: 70 },
      { name: 'Rust', value: 50 }
    ]
  },
  frameworks: {
    name: 'Frameworks',
    color: '#bb9af7',
    skills: [
      { name: 'React', value: 85 },
      { name: 'Spring', value: 75 },
      { name: 'Django', value: 70 },
      { name: 'Node.js', value: 65 },
      { name: 'Express', value: 60 },
      { name: 'Next.js', value: 55 }
    ]
  },
  tools: {
    name: 'Tools',
    color: '#9ece6a',
    skills: [
      { name: 'Git', value: 90 },
      { name: 'Docker', value: 70 },
      { name: 'Linux', value: 80 },
      { name: 'VS Code', value: 95 },
      { name: 'Postgres', value: 65 },
      { name: 'AWS', value: 50 }
    ]
  },
  concepts: {
    name: 'Concepts',
    color: '#f7768e',
    skills: [
      { name: 'Data Structures', value: 90 },
      { name: 'Algorithms', value: 85 },
      { name: 'System Design', value: 70 },
      { name: 'REST APIs', value: 80 },
      { name: 'Testing', value: 75 },
      { name: 'CI/CD', value: 60 }
    ]
  }
}

// Custom tooltip
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="radar-tooltip">
        <p className="tooltip-name">{payload[0].payload.name}</p>
        <p className="tooltip-value">{payload[0].value}%</p>
      </div>
    )
  }
  return null
}

export default function SkillRadar({ onSkillSelect }) {
  const [activeCategory, setActiveCategory] = useState('languages')

  const categoryData = skillCategories[activeCategory]

  return (
    <motion.div
      className="skill-radar"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="radar-title">Skill Proficiency</h3>

      {/* Category Tabs */}
      <div className="radar-tabs">
        {Object.entries(skillCategories).map(([key, category]) => (
          <button
            key={key}
            className={`radar-tab ${activeCategory === key ? 'active' : ''}`}
            onClick={() => setActiveCategory(key)}
            style={{
              '--tab-color': category.color,
              borderColor: activeCategory === key ? category.color : 'transparent'
            }}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Radar Chart */}
      <div className="radar-chart-container">
        <ResponsiveContainer width="100%" height={350}>
          <RadarChart
            data={categoryData.skills}
            margin={{ top: 20, right: 30, bottom: 20, left: 30 }}
          >
            <PolarGrid
              stroke="rgba(255, 255, 255, 0.1)"
              strokeDasharray="3 3"
            />
            <PolarAngleAxis
              dataKey="name"
              tick={{ fill: '#7f849c', fontSize: 12 }}
              tickLine={false}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={{ fill: '#565f89', fontSize: 10 }}
              tickCount={5}
              axisLine={false}
            />
            <Radar
              name={categoryData.name}
              dataKey="value"
              stroke={categoryData.color}
              fill={categoryData.color}
              fillOpacity={0.3}
              strokeWidth={2}
              animationDuration={500}
              dot={{
                r: 4,
                fill: categoryData.color,
                strokeWidth: 2,
                stroke: '#1a1b26'
              }}
              activeDot={{
                r: 6,
                fill: categoryData.color,
                stroke: '#fff',
                strokeWidth: 2
              }}
            />
            <Tooltip content={<CustomTooltip />} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Skill List */}
      <div className="radar-skills-list">
        {categoryData.skills.map((skill, index) => (
          <motion.div
            key={skill.name}
            className="radar-skill-item"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onSkillSelect?.(skill.name)}
            style={{ cursor: onSkillSelect ? 'pointer' : 'default' }}
          >
            <span className="skill-name">{skill.name}</span>
            <div className="skill-bar">
              <motion.div
                className="skill-bar-fill"
                initial={{ width: 0 }}
                animate={{ width: `${skill.value}%` }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                style={{ background: categoryData.color }}
              />
            </div>
            <span className="skill-value">{skill.value}%</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
