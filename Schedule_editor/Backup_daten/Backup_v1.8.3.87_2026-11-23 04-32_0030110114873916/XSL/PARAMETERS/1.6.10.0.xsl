<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->
	<xsl:template match="/Parameters/param[@id='204289']" />

	<xsl:template match="/Parameters/param[@id='69133']">
		<xsl:copy-of select="."/>
		<xsl:choose>
			<xsl:when test="/Parameters/param[@id='200712']"/>
			<xsl:otherwise>
			<param id="200712">
				<name>USE AVC SENSE</name>
				<short_name></short_name>
				<desc>Determines if torch terminals or AVC sense lines are used to sense voltage.</desc>
			</param>
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