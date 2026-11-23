<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output omit-xml-declaration="yes"/>
    <xsl:preserve-space elements="*" />
    
    <xsl:variable name="J_PER_KJ" select="1000"/>
    
    <xsl:template match="/sched/limits/heat_input_fault_low">
        <heat_input_fault_low>
            <xsl:value-of select=". * $J_PER_KJ"/>
        </heat_input_fault_low>
    </xsl:template>

    <xsl:template match="/sched/limits/heat_input_fault_high">
        <heat_input_fault_high>
            <xsl:value-of select=". * $J_PER_KJ"/>
        </heat_input_fault_high>
    </xsl:template>
        
    <xsl:template match="node()|@*" name="identity">
        <xsl:copy>
            <xsl:apply-templates select="node()|@*"/>
        </xsl:copy>
    </xsl:template>
</xsl:stylesheet>