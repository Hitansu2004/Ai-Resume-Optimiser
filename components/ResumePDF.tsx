import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";

// Register fonts
Font.register({
    family: "Helvetica",
    fonts: [
        { src: "https://fonts.gstatic.com/s/helveticaneue/v1/1Ptsg8zYS_SKggPNyC0IT4ttDfA.ttf" },
        { src: "https://fonts.gstatic.com/s/helveticaneue/v1/1Ptsg8zYS_SKggPNyC0IT4ttDfA.ttf", fontWeight: "bold" }
    ]
});

const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontFamily: "Helvetica",
        fontSize: 10,
        color: "#333",
    },
    header: {
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
        paddingBottom: 10,
    },
    name: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 5,
        textTransform: "uppercase",
    },
    contact: {
        fontSize: 10,
        color: "#666",
        marginBottom: 2,
    },
    section: {
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: "bold",
        textTransform: "uppercase",
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
        marginBottom: 8,
        paddingBottom: 2,
        color: "#000",
    },
    jobTitle: {
        fontSize: 11,
        fontWeight: "bold",
        marginTop: 5,
    },
    company: {
        fontSize: 10,
        fontStyle: "italic",
        marginBottom: 2,
    },
    date: {
        fontSize: 9,
        color: "#666",
        position: "absolute",
        right: 0,
        top: 0,
    },
    bulletPoint: {
        marginLeft: 10,
        marginBottom: 2,
        flexDirection: "row",
    },
    bullet: {
        width: 10,
    },
    bulletText: {
        flex: 1,
    },
    skillContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 5,
    },
    skill: {
        backgroundColor: "#f3f4f6",
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        fontSize: 9,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 2,
    },
});

interface ResumePDFProps {
    data: any;
}

export function ResumePDF({ data }: ResumePDFProps) {
    const { personal_info, professional_summary, skills, work_experience, education, certifications, projects } = data;

    const contactString = [
        personal_info?.phone,
        personal_info?.email,
        personal_info?.location
    ].filter(Boolean).join(" | ");

    const allSkills = [
        ...(skills?.technical || []),
        ...(skills?.soft_skills || [])
    ].filter(skill => typeof skill === 'string' && skill.trim().length > 0);

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.name}>{personal_info?.full_name || "Name Not Provided"}</Text>
                    <Text style={styles.contact}>{contactString}</Text>
                    {personal_info?.linkedin && <Text style={styles.contact}>{personal_info.linkedin}</Text>}
                    {personal_info?.github && <Text style={styles.contact}>{personal_info.github}</Text>}
                    {personal_info?.portfolio && <Text style={styles.contact}>{personal_info.portfolio}</Text>}
                </View>

                {/* Professional Summary */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Professional Summary</Text>
                    <Text style={{ lineHeight: 1.5 }}>{professional_summary || "No summary provided."}</Text>
                </View>

                {/* Skills */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Skills</Text>
                    <View style={styles.skillContainer}>
                        {allSkills.map((skill: string, i: number) => (
                            <Text key={i} style={styles.skill}>{skill}</Text>
                        ))}
                    </View>
                </View>

                {/* Experience */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Experience</Text>
                    {work_experience?.map((job: any, i: number) => (
                        <View key={i} style={{ marginBottom: 10 }}>
                            <View style={styles.row}>
                                <Text style={styles.jobTitle}>{job.role || "Role"}</Text>
                                <Text style={styles.date}>{job.dates || ""}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.company}>{job.company || "Company"} - {job.location || ""}</Text>
                            </View>
                            {Array.isArray(job.description_bullets) && job.description_bullets.map((point: any, j: number) => {
                                if (typeof point !== 'string') return null;
                                return (
                                    <View key={j} style={styles.bulletPoint}>
                                        <Text style={styles.bullet}>•</Text>
                                        <Text style={styles.bulletText}>{point.replace(/<[^>]*>/g, "")}</Text>
                                    </View>
                                );
                            })}
                        </View>
                    ))}
                </View>

                {/* Education */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Education</Text>
                    {education?.map((edu: any, i: number) => (
                        <View key={i} style={{ marginBottom: 5 }}>
                            <View style={styles.row}>
                                <Text style={{ fontWeight: "bold" }}>{edu.institution}</Text>
                                <Text style={styles.date}>{edu.date}</Text>
                            </View>
                            <Text>{edu.degree}</Text>
                        </View>
                    ))}
                </View>

                {/* Certifications */}
                {certifications && certifications.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Certifications</Text>
                        {certifications.map((cert: string, i: number) => (
                            <View key={i} style={styles.bulletPoint}>
                                <Text style={styles.bullet}>•</Text>
                                <Text style={styles.bulletText}>{cert}</Text>
                            </View>
                        ))}
                    </View>
                )}

                {/* Projects */}
                {projects && projects.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Projects</Text>
                        {projects.map((project: any, i: number) => (
                            <View key={i} style={{ marginBottom: 8 }}>
                                <View style={styles.row}>
                                    <Text style={{ fontWeight: "bold", fontSize: 11 }}>{project.title}</Text>
                                    <Text style={{ fontSize: 9, color: "#666" }}>{project.tech_stack}</Text>
                                </View>
                                <Text style={{ fontSize: 10, lineHeight: 1.4 }}>{project.description}</Text>
                            </View>
                        ))}
                    </View>
                )}
            </Page>
        </Document>
    );
}
