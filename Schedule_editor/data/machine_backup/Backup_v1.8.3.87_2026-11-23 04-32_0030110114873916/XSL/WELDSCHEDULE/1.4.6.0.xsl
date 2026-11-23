<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output indent="no" omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->

	<xsl:template match="/sched/global/gas_flow_edit_mode">
		<xsl:copy-of select="."/>
		<xsl:choose>
			<xsl:when test="/sched/global/theta_tool_center_point">
				<!-- DO NOTHING -->
			</xsl:when>
			<xsl:otherwise>
				<theta_tool_center_point>0</theta_tool_center_point>
				<travel_speed_compensated_by_height>0</travel_speed_compensated_by_height>
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