export default function SectionHeader({ eyebrow, title, description }) {
    return (
        <div className="section-header">
            <p className="eyebrow">{eyebrow}</p>
            <h2 className="section-title">{title}</h2>
            <p className="section-description">{description}</p>
        </div>
    )
}