<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output indent="no" omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->

	<xsl:template match="/head/axis/*[last()]">
		<xsl:copy-of select="."/>
		<xsl:choose>
			<xsl:when test="../forward_hard_limit_index">
				<limit_switch_active_high>1</limit_switch_active_high>
			</xsl:when>
			<xsl:otherwise>
				<xsl:choose>
					<xsl:when test="../reverse_hard_limit_index">
						<limit_switch_active_high>1</limit_switch_active_high>
					</xsl:when>
					<xsl:otherwise />
				</xsl:choose>
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