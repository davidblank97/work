<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->

	<xsl:template match="/sched/global/torch_centering_height">
		<xsl:copy-of select="."/>
		<xsl:choose>
			<xsl:when test="/sched/global/gas_flow_edit_mode">
				<!-- DO NOTHING -->
			</xsl:when>
			<xsl:otherwise>
				<gas_flow_edit_mode>0</gas_flow_edit_mode>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	
	<xsl:template match="sched/segment/dip_energy">
		<xsl:copy-of select="."/>
		<xsl:choose>
			<xsl:when test="/sched/segment/shield_flow">
				<!-- DO NOTHING -->
			</xsl:when>
			<xsl:otherwise>
				<shield_flow>0</shield_flow>
				<trail_flow>0</trail_flow>
				<plasma_flow>0</plasma_flow>
				<backup_flow>0</backup_flow>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	
	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>