<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output indent="yes" omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->

	<xsl:template match="/sched/global/travel_speed_compensated_by_height">
		<xsl:copy-of select="."/>
		<xsl:choose>
			<xsl:when test="/sched/global/osc_auto_preposition">
				<!-- DO NOTHING -->
			</xsl:when>
			<xsl:otherwise>
				<osc_auto_preposition>0</osc_auto_preposition>
				<theta_auto_preposition>0</theta_auto_preposition>
				<ahc_auto_preposition>0</ahc_auto_preposition>
				<ahc_auto_postposition>0.000000</ahc_auto_postposition>
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