<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->
	<xsl:template match="/sched/global/initial_wire2_speed">
		<xsl:copy-of select="."/>
		<xsl:choose>
			<xsl:when test="/sched/global/osc_centre_position_offset"/>
			<xsl:otherwise>
				<osc_centre_position_offset>0</osc_centre_position_offset>
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