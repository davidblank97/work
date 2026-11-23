<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->

	<!-- Using desc since that is not translated between languages and is the same for all language files -->
	<!-- NOTE: Do not match based on content in the future since content can change -->
	<xsl:template match="/language/text[@id='470'][desc = 'Refers to the measured heat input.']" />

	<xsl:template match="/language/text[@id='505']">
		<xsl:copy-of select="."/>
		<text id="506">
			<content>HEAT INPUT</content>
			<desc>Refers to the measured heat input.</desc>
		</text>
	</xsl:template>

	<xsl:template match="/language/text[@id='506']/@id">
		<xsl:attribute name="id">
			<xsl:value-of select="'507'"/>
		</xsl:attribute>
	</xsl:template>

	<xsl:template match="/language/text[@id='507']/@id">
		<xsl:attribute name="id">
			<xsl:value-of select="'508'"/>
		</xsl:attribute>
	</xsl:template>

	<xsl:template match="/language/text[@id='508']/@id">
		<xsl:attribute name="id">
			<xsl:value-of select="'509'"/>
		</xsl:attribute>
	</xsl:template>

	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>