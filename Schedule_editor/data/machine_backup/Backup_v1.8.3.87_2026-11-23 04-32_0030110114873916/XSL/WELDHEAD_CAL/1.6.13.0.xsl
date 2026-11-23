<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->
	<xsl:template match="/cal/axis[@name='travel']/tel_offset">
		<xsl:copy-of select="."/>
		<xsl:choose>
			<xsl:when test="/cal/axis[@name='travel']/rev_gain"/>
			<xsl:otherwise>
				<rev_gain timestamp="">1.0000</rev_gain>
				<rev_offset>0.0000</rev_offset>
				<rev_tel_gain>1.0000</rev_tel_gain>
				<rev_tel_offset>0.0000</rev_tel_offset>
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