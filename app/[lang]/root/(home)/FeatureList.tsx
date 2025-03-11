interface Props {}

type FeatureItem = {
  icon: any
  title: string
  description: string
}

const features: FeatureItem[] = [
  {
    icon: '',
    title: '自定义编辑器',
    description: '可以自定义编辑器标题和段落字体类型、大小，以及设置内容间距。',
  },
  {
    icon: '',
    title: '自定义编辑器',
    description: '可以自定义编辑器标题和段落字体类型、大小，以及设置内容间距。',
  },
  {
    icon: '',
    title: '自定义编辑器',
    description: '可以自定义编辑器标题和段落字体类型、大小，以及设置内容间距。',
  },
]

export function FeatureList() {
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3">
        {features.map((feature, index) => (
          <div key={index}>
            <div>{feature.title}</div>
            <div>{feature.description}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
